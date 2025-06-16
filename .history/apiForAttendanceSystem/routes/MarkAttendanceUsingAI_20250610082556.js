import express from 'express';
import { markAttendance, upload } from '../controllers/AttendanceController.js';

const router = express.Router();

// Route to mark attendance using AI
router.post('/mark-attendance', upload.single('image'), markAttendance);

export default router;

