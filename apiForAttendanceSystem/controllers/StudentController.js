import Student from '../models/StudentModel.js';
import multer from 'multer';

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files are allowed'));
    cb(null, true);
  },
});

export const registerStudent = async (req, res) => {
  try {
    const { name, enrollment_id, email, course } = req.body;

    if (!name || !enrollment_id || !email || !course) {
      return res.status(400).json({ message: 'name, enrollment_id, email, and course are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Profile image is required' });
    }

    const profileImage = req.file.buffer.toString('base64');
    const student = new Student({ name, enrollment_id, email, course, profileImage });
    await student.save();

    res.status(201).json({ message: 'Student registered successfully', student });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({ message: `A student with that ${field} already exists` });
    }
    console.error('registerStudent error:', error);
    res.status(500).json({ message: 'Error registering student', error: error.message });
  }
};

export const getStudents = async (_req, res) => {
  try {
    const students = await Student.find({}, '-profileImage'); // exclude blob from list
    res.status(200).json(students);
  } catch (error) {
    console.error('getStudents error:', error);
    res.status(500).json({ message: 'Error retrieving students', error: error.message });
  }
};
