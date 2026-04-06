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
    <section>
      <h2>Students</h2>
      {status && <p>{status}</p>}
      {!status && students.length === 0 && <p>No students found.</p>}
      <ul>
        {students.map((student) => (
          <li key={student._id || student.id || student.enrollment_id}>
            {student.name} ({student.enrollment_id || student.Id || 'N/A'})
          </li>
        ))}
      </ul>
    </section>
  );
}

export default StudentList;
