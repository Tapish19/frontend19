import express from 'express';
import { markAttendance, upload } from '../controllers/AttendanceController.js';

const router = express.Router();

// Accept any image field for attendance marking
router.post('/mark-attendance', upload.any(), async (req, res) => {
  try {
    const file = req.files && req.files.length > 0 ? req.files[0] : null;

    if (!file) {
      return res.status(400).json({ message: 'Image upload is required' });
    }

    const result = await markAttendance(file, req, res);
    res.status(200).json({ message: 'Attendance marked', data: result });
  } catch (err) {
    res.status(500).json({ message: 'Error processing attendance', error: err.message });
  }
});

export default router;
