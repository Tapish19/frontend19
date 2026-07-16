import express from 'express';
import { confirmAttendance, markAttendance, upload } from '../controllers/AttendanceController.js';

const router = express.Router();

router.post('/mark-attendance', upload.single('image'), markAttendance);
router.post('/confirm-attendance', confirmAttendance);

export default router;
