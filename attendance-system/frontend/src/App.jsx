import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import AttendanceForm from './components/AttendanceForm';
import StudentRegistration from './components/StudentRegistration';
import StudentList from './components/StudentList';
import './App.css';

function WelcomePanel() {
  return (
    <section className="panel">
      <h2>Welcome</h2>
      <p>
        Use the navigation above to register students, mark attendance, or review the student roster.
      </p>
    </section>
  );
}


function App() {
  return (
    <Router>
       <div className="app-shell">
        <header className="app-header">
          <h1>Attendance System</h1>
          <p>Simple, clean workflow for managing attendance records.</p>
        </header>

        <nav className="top-nav" aria-label="Main navigation">
          <NavLink to="/mark-attendance" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Mark Attendance
          </NavLink>
          <NavLink to="/register-student" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Register Student
          </NavLink>
          <NavLink to="/student-list" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            View Students
          </NavLink>
        </nav>

        <Routes>
          <Route path="/mark-attendance" element={<AttendanceForm />} />
          <Route path="/register-student" element={<StudentRegistration />} />
          <Route path="/student-list" element={<StudentList />} />
          <Route path="/" element={<WelcomePanel />} />
        </Routes>
      </div>
    </Router>  
  );
}

export default App;
