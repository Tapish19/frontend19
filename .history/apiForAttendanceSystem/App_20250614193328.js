import express from 'express';
import cors from 'cors';
import connectDB from './DBConnect/db.js';
import apiRoutes from './routes/studentR.js';
import studentRegistrationRoutes from './routes/StudentRegistration.js';
import markAttendanceRoutes from './routes/MarkAttendanceUsingAI.js'; // Use import for ES module
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', apiRoutes);
app.use('/', studentRegistrationRoutes);
app.use('/', markAttendanceRoutes); // Use the route

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});