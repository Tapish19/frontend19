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

  const onChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('Submitting...');

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('enrollment_id', form.enrollment_id);
      formData.append('email', form.email);
      formData.append('course', form.course);
      if (form.profileImage) formData.append('ProfileImage', form.profileImage);

      const response = await registerStudent(formData);
      setMessage(response?.message || 'Student registered successfully.');
    } catch (error) {
      setMessage(error.message || 'Failed to register student.');
    }
  };

  return (
    <section>
      <h2>Register Student</h2>
      <form onSubmit={onSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={onChange} required />
        <input
          name="enrollment_id"
          placeholder="Enrollment ID"
          value={form.enrollment_id}
          onChange={onChange}
          required
        />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input name="course" placeholder="Course" value={form.course} onChange={onChange} required />
        <input name="profileImage" type="file" accept="image/*" onChange={onChange} required />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
}

export default StudentRegistration;
