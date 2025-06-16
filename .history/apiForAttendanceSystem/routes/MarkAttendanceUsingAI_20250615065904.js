import express from 'express';
import { upload, markAttendance } from '../controllers/AttendanceController.js';

const router = express.Router();

// Accept image from any field name
router.post('/mark-attendance', upload.any(), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // You can access the uploaded file like this:
    const file = req.files[0]; // Since .any() allows multiple, pick the first one

    // Pass the file manually to your markAttendance logic
    const result = await markAttendance(file, req, res);
    res.status(200).json({ message: 'File processed', data: result });
  } catch (err) {
    console.error('Error processing image:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

export default router;
