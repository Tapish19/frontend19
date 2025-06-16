import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Update with your Django backend URL

export const getAttendanceData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/attendance/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        throw error;
    }
};

export const registerStudent = async (studentData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/students/`, studentData);
        return response.data;
    } catch (error) {
        console.error('Error registering student:', error);
        throw error;
    }
};

export const processFaceImage = async (imageData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/process-face-image/`, imageData);
        return response.data;
    } catch (error) {
        console.error('Error processing face image:', error);
        throw error;
    }
};