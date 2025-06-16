import express from 'express';
import { registerStudent, getStudents, upload } from '../controllers/StudentController.js';

const router = express.Router();

// Route to register a student with image (accept any field name)
router.post('/Registration', upload.any(), registerStudent);

// Route to get all students
router.get('/students', getStudents);

export default router;
