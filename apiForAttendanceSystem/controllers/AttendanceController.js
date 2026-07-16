import axios from 'axios';
import Attendance from '../models/AttendanceModel.js';
import QueryFaces from '../models/QueryFacesModel.js';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files are allowed'));
    cb(null, true);
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getTimestamp = () => ({
  time: new Date().toLocaleTimeString(),
  date: new Date().toLocaleDateString(),
});

const normaliseMatchedStudent = (student, index) => ({
  face_index: student.face_index ?? student.index ?? index,
  name: student.name || 'Unknown student',
  enrollment_number: student.enrollment_number || student.enrollment_id || student.student_id || '',
  similarity: student.similarity ?? student.confidence ?? student.score ?? null,
  confidence: student.confidence ?? student.similarity ?? student.score ?? null,
  bounding_box: student.bounding_box || student.bbox || student.box || null,
  face_crop: student.face_crop || student.crop_url || student.face_image || student.image || null,
});

export const markAttendance = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const { id = 'class-photo', name = 'Class photo', course = 'General' } = req.body;

    const base64Image = req.file.buffer.toString('base64');
    const uploadResponse = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${base64Image}`
    );

    const externalApiUrl = process.env.EXTERNAL_API_URL;
    if (!externalApiUrl) {
      return res.status(500).json({ message: 'EXTERNAL_API_URL is not configured' });
    }

    const response = await axios.post(externalApiUrl, {
      id,
      name,
      course,
      image: uploadResponse.secure_url,
    });

    const matchedStudents = Array.isArray(response.data?.matched_students)
      ? response.data.matched_students.map(normaliseMatchedStudent)
      : [];

    res.status(200).json({
      message: matchedStudents.length
        ? `Review ${matchedStudents.length} detected student match(es) before confirming attendance.`
        : 'No registered students matched the uploaded class photo',
      data: {
        ...response.data,
        image: uploadResponse.secure_url,
        course,
        matched_students: matchedStudents,
      },
    });
  } catch (error) {
    console.error('markAttendance error:', error);
    res.status(500).json({ message: 'Error processing attendance image', error: error.message });
  }
};

export const confirmAttendance = async (req, res) => {
  try {
    const {
      image,
      course = 'General',
      id = 'class-photo',
      name = 'Class photo',
      students = [],
      matched_students: matchedStudents = [],
    } = req.body;

    const selectedStudents = Array.isArray(students) && students.length ? students : matchedStudents;

    if (!image) {
      return res.status(400).json({ message: 'Class photo image URL is required' });
    }

    if (!Array.isArray(selectedStudents) || selectedStudents.length === 0) {
      return res.status(400).json({ message: 'Select at least one student to confirm attendance' });
    }

    const { time, date } = getTimestamp();
    const attendanceRows = selectedStudents.map((student) => ({
      time,
      date,
      id: student.enrollment_number || student.enrollment_id || student.student_id || student.id || id,
      name: student.name || 'Unknown student',
      image,
      course: student.course || course,
    }));

    await Attendance.insertMany(attendanceRows);
    await new QueryFaces({ time, date, id, name, image, course }).save();

    res.status(200).json({
      message: `Attendance confirmed for ${attendanceRows.length} student(s).`,
      confirmed_count: attendanceRows.length,
    });
  } catch (error) {
    console.error('confirmAttendance error:', error);
    res.status(500).json({ message: 'Error confirming attendance', error: error.message });
  }
};
