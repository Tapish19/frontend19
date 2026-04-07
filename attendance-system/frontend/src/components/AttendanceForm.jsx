import { useState } from 'react';
import { markAttendance } from '../api/nodeApi';

function AttendanceForm() {
  const [form, setForm] = useState({ id: '', name: '', course: '', image: null });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const onChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('Submitting attendance...');
    setMessageType('info');

    try {
      const formData = new FormData();
      formData.append('id', form.id);
      formData.append('name', form.name);
      formData.append('course', form.course);
      if (form.image) formData.append('image', form.image);

      const response = await markAttendance(formData);
      setMessage(response?.message || 'Attendance marked successfully.');
      setMessageType('success');
    } catch (error) {
      setMessage(error.message || 'Failed to mark attendance.');
      setMessageType('error');
    }
  };

  return (
    <section className="panel">      
      <h2>Mark Attendance</h2>
      <form onSubmit={onSubmit}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="attendance-id">Student ID</label>
            <input id="attendance-id" name="id" placeholder="e.g. STU-102" value={form.id} onChange={onChange} required />
          </div>
          <div className="field">
            <label htmlFor="attendance-name">Student Name</label>
            <input id="attendance-name" name="name" placeholder="e.g. Sarah Khan" value={form.name} onChange={onChange} required />
          </div>
          <div className="field">
            <label htmlFor="attendance-course">Course</label>
            <input id="attendance-course" name="course" placeholder="e.g. Computer Science" value={form.course} onChange={onChange} required />
          </div>
          <div className="field">
            <label htmlFor="attendance-image">Photo</label>
            <input id="attendance-image" name="image" type="file" accept="image/*" onChange={onChange} required />
          </div>
        </div>

        <div className="button-row">
          <button className="primary-btn" type="submit">Submit Attendance</button>
        </div>
      </form>
      {message && <p className={`message ${messageType}`}>{message}</p>}
    </section>
  );
}

export default AttendanceForm;
