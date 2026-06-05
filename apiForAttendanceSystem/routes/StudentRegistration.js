import express from 'express';
import { registerStudent, getStudents, upload } from '../controllers/StudentController.js';

const router = express.Router();

router.post('/registration', upload.single('profileImage'), registerStudent);
router.get('/students', getStudents);

export default router;
