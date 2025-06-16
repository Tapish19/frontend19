import Student from '../models/StudentModel.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const registerStudent = async (req, res) => {
    try {
        const { name, enrollment_id, email, course } = req.body;
        const profileImage = req.file.buffer.toString('base64'); // Convert image buffer to base64

        // Save student record to the database
        const student = new Student({ name, enrollment_id, email, course, profileImage });
        await student.save();

        res.status(201).json({ message: 'Student registered successfully', student });
    } catch (error) {
        res.status(500).json({ message: 'Error registering student', error: error.message });
    }
};

export const getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving students', error: error.message });
    }
};

export { upload };
