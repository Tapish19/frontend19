import { useState } from 'react';
import { registerStudent } from '../api/nodeApi';

function StudentRegistration() {
  const EMPTY = { name: '', enrollment_id: '', email: '', course: '', profileImage: null };
  const [form, setForm] = useState(EMPTY);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const onChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage') {
      const file = files[0] || null;
      setForm((p) => ({ ...p, profileImage: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.profileImage) { setMessage('Profile image is required'); setMessageType('error'); return; }
    if (form.profileImage.size > 5 * 1024 * 1024) { setMessage('Image must be under 5MB'); setMessageType('error'); return; }

    setLoading(true);
    setMessage('Registering...');
    setMessageType('info');

    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('enrollment_id', form.enrollment_id);
      fd.append('email', form.email);
      fd.append('course', form.course);
      fd.append('profileImage', form.profileImage);

      const res = await registerStudent(fd);
      setMessage(res?.message || 'Student registered successfully.');
      setMessageType('success');
      setForm(EMPTY);
      setPreview(null);
    } catch (err) {
      setMessage(err.message || 'Failed to register student.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <h2>Register Student</h2>
      <form onSubmit={onSubmit}>
        <div className="form-grid">
          <div className="field">
            <label>Full Name</label>
            <input name="name" placeholder="Sarah Khan" value={form.name} onChange={onChange} required />
          </div>
          <div className="field">
            <label>Enrollment ID</label>
            <input name="enrollment_id" placeholder="ENR-2026-01" value={form.enrollment_id} onChange={onChange} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" placeholder="student@school.edu" value={form.email} onChange={onChange} required />
          </div>
          <div className="field">
            <label>Course</label>
            <input name="course" placeholder="Information Technology" value={form.course} onChange={onChange} required />
          </div>
          <div className="field">
            <label>Profile Photo</label>
            <input name="profileImage" type="file" accept="image/*" onChange={onChange} required />
          </div>
        </div>
        {preview && <img src={preview} alt="Preview" width="120" style={{ borderRadius: '8px', marginTop: '10px' }} />}
        <div className="button-row">
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register Student'}
          </button>
        </div>
      </form>
      {message && <p className={`message ${messageType}`}>{message}</p>}
    </section>
  );
}

export default StudentRegistration;
