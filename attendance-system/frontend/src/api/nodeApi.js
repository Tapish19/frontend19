async function markAttendance(formData) {
  try {
    const res = await fetch('http://localhost:5000/mark-attendance', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error('Attendance failed');

    return await res.json();
  } catch (err) {
    console.error('❌ Error marking attendance:', err);
    throw err;
  }
}
