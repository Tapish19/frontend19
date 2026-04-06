import axios from 'axios';

// Use env variable if available, else fallback to local backend
const API_BASE_URL =
  process.env.REACT_APP_DJANGO_API_URL || 'http://127.0.0.1:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==============================
// Attendance
// ==============================
export const getAttendanceData = async () => {
  try {
    const response = await api.get('/attendance/');
    return response.data;
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    throw error;
  }
};

// ==============================
// Students
// ==============================
export const registerStudent = async (studentData) => {
  try {
    const response = await api.post('/students/', studentData);
    return response.data;
  } catch (error) {
    console.error('Error registering student:', error);
    throw error;
  }
};

export const fetchStudents = async () => {
  try {
    const response = await api.get('/students/');
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

// ==============================
// Face Processing
// ==============================
export const processFaceImage = async (imageData) => {
  try {
    const response = await api.post(
      '/process-face-image/',
      imageData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error processing face image:', error);
    throw error;
  }
};
