import React, { useState } from 'react';
import { markAttendance } from '../api/nodeApi'; // Adjust the import based on your API structure

const AttendanceForm = () => {
    const [studentId, setStudentId] = useState('');
    const [studentName, setStudentName] = useState('');
    const [course, setCourse] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('id', studentId);
        formData.append('name', studentName);
        formData.append('course', course);
        formData.append('image', image);

        try {
            const response = await markAttendance(formData);
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error marking attendance: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Mark Attendance</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="studentId">Student ID:</label>
                    <input
                        type="text"
                        id="studentId"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="studentName">Student Name:</label>
                    <input
                        type="text"
                        id="studentName"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="course">Course:</label>
                    <input
                        type="text"
                        id="course"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="image">Upload Image:</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AttendanceForm;