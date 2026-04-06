import { useState } from 'react';
import { markAttendance } from '../api/nodeApi';

function AttendanceForm() {
  const [form, setForm] = useState({ id: '', name: '', course: '', image: null });
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('Submitting...');

    try {
      const formData = new FormData();
      formData.append('id', form.id);
      formData.append('name', form.name);
      formData.append('course', form.course);
      if (form.image) formData.append('image', form.image);

      const response = await markAttendance(formData);
      setMessage(response?.message || 'Attendance marked successfully.');
    } catch (error) {
      setMessage(error.message || 'Failed to mark attendance.');
    }
  };

  return (
    <section>
      <h2>Mark Attendance</h2>
      <form onSubmit={onSubmit}>
        <input name="id" placeholder="Student ID" value={form.id} onChange={onChange} required />
        <input name="name" placeholder="Student Name" value={form.name} onChange={onChange} required />
        <input name="course" placeholder="Course" value={form.course} onChange={onChange} required />
        <input name="image" type="file" accept="image/*" onChange={onChange} required />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
}

export default AttendanceForm;
