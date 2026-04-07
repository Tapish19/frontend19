import { useState } from 'react';
import { registerStudent } from '../api/nodeApi';

function StudentRegistration() {
  const [form, setForm] = useState({
    name: '',
    enrollment_id: '',
    email: '',
    course: '',
    profileImage: null
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const onChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profileImage') {
      const file = files[0];
      setForm((prev) => ({ ...prev, profileImage: file }));

      if (file) {
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.profileImage) {
      setMessage('Profile image is required');
      setMessageType('error');
      return;
    }

    if (form.profileImage.size > 2 * 1024 * 1024) {
      setMessage('Image must be less than 2MB');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('Submitting...');
    setMessageType('info');

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('enrollment_id', form.enrollment_id);
      formData.append('email', form.email);
      formData.append('course', form.course);
      formData.append('profileImage', form.profileImage);

      const response = await registerStudent(formData);

      setMessage(response?.message || 'Student registered successfully.');
      setMessageType('success');

      // Reset form
      setForm({
        name: '',
        enrollment_id: '',
        email: '',
        course: '',
        profileImage: null
      });
      setPreview(null);

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        error.message ||
        'Failed to register student.'
      );
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>Register Student</h2>

      <form onSubmit={onSubmit}>
        <div className="form-grid">

          <div className="field">
            <label htmlFor="student-name">Full Name</label>
            <input
              id="student-name"
              name="name"
              placeholder="e.g. Sarah Khan"
              value={form.name}
              onChange={onChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="student-enrollment">Enrollment ID</label>
            <input
              id="student-enrollment"
              name="enrollment_id"
              placeholder="e.g. ENR-2026-01"
              value={form.enrollment_id}
              onChange={onChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="student-email">Email</label>
            <input
              id="student-email"
              name="email"
              type="email"
              placeholder="student@school.edu"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="student-course">Course</label>
            <input
              id="student-course"
              name="course"
              placeholder="e.g. Information Technology"
              value={form.course}
              onChange={onChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="student-image">Profile Image</label>
            <input
              id="student-image"
              name="profileImage"
              type="file"
              accept="image/*"
              onChange={onChange}
              required
            />
          </div>

        </div>

        {/* Image Preview */}
        {preview && (
          <div style={{ marginTop: '10px' }}>
            <img src={preview} alt="Preview" width="120" />
          </div>
        )}

        <div className="button-row">
          <button
            className="primary-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register Student'}
          </button>
        </div>
      </form>

      {message && (
        <p className={`message ${messageType}`}>
          {message}
        </p>
      )}
    </section>
  );
}

export default StudentRegistration;
