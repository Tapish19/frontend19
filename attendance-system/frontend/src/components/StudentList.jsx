import { useEffect, useState } from 'react';
import { fetchStudents } from '../api/djangoApi';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    let mounted = true;

    async function loadStudents() {
      try {
        const data = await fetchStudents();
        if (!mounted) return;

        setStudents(Array.isArray(data) ? data : []);
        setStatus('');
      } catch (error) {
        if (!mounted) return;
        setStatus('Unable to load students.');
      }
    }

    loadStudents();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="panel">
      <h2>Student Directory</h2>
      {status && <p className="message info">{status}</p>}
      {!status && students.length === 0 && <p className="empty-state">No students found yet.</p>}

      {!status && students.length > 0 && (
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Enrollment ID</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id || student.id || student.enrollment_id}>
                <td>{student.name}</td>
                <td>{student.enrollment_id || student.Id || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default StudentList;
