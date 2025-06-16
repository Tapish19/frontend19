import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AttendanceForm from './components/AttendanceForm';
import StudentRegistration from './components/StudentRegistration';
import StudentList from './components/StudentList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mark-attendance" element={<AttendanceForm />} />
        <Route path="/register-student" element={<StudentRegistration />} />
        <Route path="/student-list" element={<StudentList />} />
      </Routes>
    </Router>
  );
}

export default App;