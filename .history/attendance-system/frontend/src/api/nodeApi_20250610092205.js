import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Adjust the URL as needed

export const markAttendance = async (attendanceData) => {
    try {
        const response = await axios.post(`${API_URL}/mark-attendance`, attendanceData);
        return response.data;
    } catch (error) {
        throw new Error('Error marking attendance: ' + error.message);
    }
};

export const registerStudent = async (studentData) => {
    try {
        const response = await axios.post(`${API_URL}/register-student`, studentData);
        return response.data;
    } catch (error) {
        throw new Error('Error registering student: ' + error.message);
    }
};

export const getStudents = async () => {
    try {
        const response = await axios.get(`${API_URL}/students`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching students: ' + error.message);
    }
};