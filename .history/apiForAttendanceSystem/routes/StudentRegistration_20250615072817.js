import express from 'express';
import { registerStudent, getStudents, upload } from '../controllers/StudentController.js';
import Student from '../models/Student.js'; // <-- Make sure to import your Student model

const router = express.Router();

router.get('/is-registered', async (req, res) => {
  const { email, enrollment_id } = req.query;
  try {
    const student = await Student.findOne({
      $or: [
        { email: email },
        { enrollment_id: enrollment_id }
      ]
    });
    if (student) {
      res.json({ registered: true, student });
    } else {
      res.json({ registered: false });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to register a student with image (accept any field name)
router.post('/Registration', upload.any(), registerStudent);

// Route to get all students
router.get('/students', getStudents);

export default router;