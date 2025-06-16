import express from 'express';
import cors from 'cors';
import connectDB from './DBConnect/db.js';
import apiRoutes from './routes/StudentRegistration.js';
import studentRegistrationRoutes from './routes/StudentRegistration.js';
import markAttendanceRoutes from './routes/MarkAttendanceUsingAI.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static frontend from public/
app.use(express.static('public'));

// Routes
app.use('/', apiRoutes);
app.use('/', studentRegistrationRoutes);
app.use('/', markAttendanceRoutes);

app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
