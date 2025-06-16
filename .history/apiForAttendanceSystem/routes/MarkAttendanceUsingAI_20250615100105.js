import express from 'express';
import { markAttendance, upload } from '../controllers/AttendanceController.js';

const router = express.Router();

router.post('/mark-attendance', upload.any(), async (req, res) => {
  console.log('Received mark-attendance request');
  try {
    const file = req.files && req.files.length > 0 ? req.files[0] : null;

    if (!file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'Image upload is required' });
    }

    // Only pass file and req, NOT res
    const result = await markAttendance(file, req);
    res.status(200).json({ message: 'Attendance marked', data: result });
  } catch (err) {
    console.error('Error in /mark-attendance:', err);
    res.status(500).json({ message: 'Error processing attendance', error: err.message });
  }
});

export default router;