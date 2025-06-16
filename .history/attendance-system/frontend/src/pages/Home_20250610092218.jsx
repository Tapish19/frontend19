import React from 'react';
import { Link } from 'react-router-dom';
import AttendanceForm from '../components/AttendanceForm';
import StudentRegistration from '../components/StudentRegistration';
import StudentList from '../components/StudentList';

const Home = () => {
    return (
        <div className="home">
            <h1>Welcome to the Attendance System</h1>
            <p>Select an option below:</p>
            <div className="options">
                <Link to="/mark-attendance">Mark Attendance</Link>
                <Link to="/register-student">Register Student</Link>
                <Link to="/student-list">View Students</Link>
            </div>
            <AttendanceForm />
            <StudentRegistration />
            <StudentList />
        </div>
    );
};

export default Home;