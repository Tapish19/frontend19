import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './DBConnect/db.js';

// Import your routes
import studentRoutes from './routes/StudentRegistration.js';
import markAttendanceRoutes from './routes/MarkAttendanceUsingAI.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Mount routes
app.use('/', studentRoutes); // /Registration and /students
app.use('/', markAttendanceRoutes); // /mark-attendance

// Health check route
app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});