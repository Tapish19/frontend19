import { useState } from 'react';
import { markAttendance } from '../api/nodeApi';

function AttendanceForm() {
  const EMPTY = { course: '', image: null };
  const [form, setForm] = useState(EMPTY);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [matchedStudents, setMatchedStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value, files } = e.target;
    setForm((p) => ({ ...p, [name]: files ? files[0] : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) { setMessage('Class photo is required'); setMessageType('error'); return; }

    setLoading(true);
    setMatchedStudents([]);
    setMessage('Processing class photo...');
    setMessageType('info');

    try {
      const fd = new FormData();
      fd.append('course', form.course || 'General');
      fd.append('image', form.image);

      const res = await markAttendance(fd);
      const result = res?.data;
      const students = Array.isArray(result?.matched_students) ? result.matched_students : [];
      setMatchedStudents(students);

      if (students.length > 0) {
        setMessage(`✓ Marked attendance for ${students.length} student(s) from this class photo.`);
        setMessageType('success');
      } else {
        setMessage(result?.message || 'No registered students matched this class photo.');
        setMessageType('error');
      }
      setForm(EMPTY);
    } catch (err) {
      setMessage(err.message || 'Failed to mark attendance.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <h2>Mark Class Attendance</h2>
      <p className="helper-text">
        Upload one classroom or group photo. The system will detect all registered students it can recognise and mark them present together.
      </p>
      <form onSubmit={onSubmit}>
        <div className="form-grid">
          <div className="field">
            <label>Course / Class</label>
            <input name="course" placeholder="Computer Science" value={form.course} onChange={onChange} />
          </div>
          <div className="field">
            <label>Class Photo</label>
            <input name="image" type="file" accept="image/*" onChange={onChange} required />
          </div>
        </div>
        <div className="button-row">
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Mark Class Attendance'}
          </button>
        </div>
      </form>
      {message && <p className={`message ${messageType}`}>{message}</p>}
      {matchedStudents.length > 0 && (
        <div className="results-list">
          <h3>Recognised students</h3>
          <ul>
            {matchedStudents.map((student) => (
              <li key={`${student.enrollment_number}-${student.face_index}`}>
                <strong>{student.name}</strong> ({student.enrollment_number}) — {(student.similarity * 100).toFixed(1)}% match
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default AttendanceForm;
