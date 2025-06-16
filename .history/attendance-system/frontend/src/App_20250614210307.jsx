import AttendanceForm from './components/AttendanceForm';
import StudentRegistration from './components/StudentRegistration';
import StudentList from './components/StudentList';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/mark-attendance">Mark Attendance</Link> |{' '}
        <Link to="/register-student">Register Student</Link> |{' '}
        <Link to="/student-list">View Students</Link>
      </nav>
      <Routes>
        <Route path="/mark-attendance" element={<AttendanceForm />} />
        <Route path="/register-student" element={<StudentRegistration />} />
        <Route path="/student-list" element={<StudentList />} />
        <Route path="/" element={<div>Welcome to the Attendance System</div>} />
      </Routes>
    </Router>
  );
}

export default App;