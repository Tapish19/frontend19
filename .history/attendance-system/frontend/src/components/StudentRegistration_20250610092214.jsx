import React, { useState } from 'react';
import { registerStudent } from '../api/nodeApi';

const StudentRegistration = () => {
    const [name, setName] = useState('');
    const [enrollmentId, setEnrollmentId] = useState('');
    const [email, setEmail] = useState('');
    const [course, setCourse] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('enrollment_id', enrollmentId);
        formData.append('email', email);
        formData.append('course', course);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        try {
            const response = await registerStudent(formData);
            setMessage(response.data.message);
            // Clear the form
            setName('');
            setEnrollmentId('');
            setEmail('');
            setCourse('');
            setProfileImage(null);
        } catch (error) {
            setMessage('Error registering student: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Student Registration</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Enrollment ID:</label>
                    <input type="text" value={enrollmentId} onChange={(e) => setEnrollmentId(e.target.value)} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Course:</label>
                    <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} required />
                </div>
                <div>
                    <label>Profile Image:</label>
                    <input type="file" onChange={(e) => setProfileImage(e.target.files[0])} />
                </div>
                <button type="submit">Register Student</button>
            </form>
        </div>
    );
};

export default StudentRegistration;