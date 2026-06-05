import { useState } from 'react';
import { markAttendance } from '../api/nodeApi';

function AttendanceForm() {
  const EMPTY = { id: '', name: '', course: '', image: null };
  const [form, setForm] = useState(EMPTY);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value, files } = e.target;
    setForm((p) => ({ ...p, [name]: files ? files[0] : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) { setMessage('Photo is required'); setMessageType('error'); return; }

    setLoading(true);
    setMessage('Submitting...');
    setMessageType('info');

    try {
      const fd = new FormData();
      fd.append('id', form.id);
      fd.append('name', form.name);
      fd.append('course', form.course);
      fd.append('image', form.image);

      const res = await markAttendance(fd);
      const result = res?.data;

      if (result?.matched) {
        setMessage(`✓ ${result.student_name} recognised (${(result.similarity * 100).toFixed(1)}% match)`);
        setMessageType('success');
      } else {
        setMessage(result?.message || 'No face match found.');
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
      <h2>Mark Attendance</h2>
      <form onSubmit={onSubmit}>
        <div className="form-grid">
          <div className="field">
            <label>Student ID</label>
            <input name="id" placeholder="STU-102" value={form.id} onChange={onChange} required />
          </div>
          <div className="field">
            <label>Student Name</label>
            <input name="name" placeholder="Sarah Khan" value={form.name} onChange={onChange} required />
          </div>
          <div className="field">
            <label>Course</label>
            <input name="course" placeholder="Computer Science" value={form.course} onChange={onChange} required />
          </div>
          <div className="field">
            <label>Photo</label>
            <input name="image" type="file" accept="image/*" onChange={onChange} required />
          </div>
        </div>
        <div className="button-row">
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Submit Attendance'}
          </button>
        </div>
      </form>
      {message && <p className={`message ${messageType}`}>{message}</p>}
    </section>
  );
}

export default AttendanceForm;
