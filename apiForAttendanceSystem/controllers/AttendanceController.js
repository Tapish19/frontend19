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

    const time = new Date().toLocaleTimeString();
    const date = new Date().toLocaleDateString();

    const externalApiUrl = process.env.EXTERNAL_API_URL;
    if (!externalApiUrl) {
      return res.status(500).json({ message: 'EXTERNAL_API_URL is not configured' });
    }

    const response = await axios.post(externalApiUrl, {
      id, name, course, image: uploadResponse.secure_url,
    });

    const matchedStudents = Array.isArray(response.data?.matched_students) ? response.data.matched_students : [];

    if (matchedStudents.length > 0) {
      await Attendance.insertMany(matchedStudents.map((student) => ({
        time,
        date,
        id: student.enrollment_number || student.student_id || id,
        name: student.name,
        image: uploadResponse.secure_url,
        course,
      })));
    }

    await new QueryFaces({ time, date, id, name, image: uploadResponse.secure_url, course }).save();

    res.status(200).json({
      message: matchedStudents.length
        ? `Attendance marked for ${matchedStudents.length} student(s)`
        : 'No registered students matched the uploaded class photo',
      data: response.data,
    });
  } catch (error) {
    console.error('markAttendance error:', error);
    res.status(500).json({ message: 'Error marking attendance', error: error.message });
  }
};
