import express from 'express';
import { registerStudent, getStudents, upload } from '../controllers/StudentController.js';

const router = express.Router();

// Route to register a student
router.post('/Registration', upload.single('ProfileImage'), registerStudent);
router.post('/register-student', upload.single('ProfileImage'), registerStudent);

// Route to get all students
router.get('/students', getStudents);

export default router;