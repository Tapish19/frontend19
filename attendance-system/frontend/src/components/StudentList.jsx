import { useEffect, useState } from 'react';
import { getStudents } from '../api/nodeApi';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await getStudents();
        if (!mounted) return;
        setStudents(Array.isArray(data) ? data : []);
        setStatus('');
      } catch {
        if (!mounted) return;
        setStatus('Unable to load students. Make sure the server is running.');
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="panel">
      <h2>Student Directory</h2>
      {status && <p className="message info">{status}</p>}
      {!status && students.length === 0 && <p>No students registered yet.</p>}
      {!status && students.length > 0 && (
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th><th>Enrollment ID</th><th>Email</th><th>Course</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id || s.enrollment_id}>
                <td>{s.name}</td>
                <td>{s.enrollment_id}</td>
                <td>{s.email}</td>
                <td>{s.course}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default StudentList;
