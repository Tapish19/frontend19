// === Student Registration ===
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  try {
    const res = await fetch('/Registration', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    document.getElementById('regResult').innerText = data.message || 'Registered!';
    form.reset();
  } catch (err) {
    document.getElementById('regResult').innerText = 'Error: ' + err.message;
  }
});

// === Attendance Marking ===
document.getElementById('attendanceForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  try {
    const res = await fetch('/mark-attendance', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    document.getElementById('attendanceResult').innerText = data.message || 'Attendance marked!';
    form.reset();
  } catch (err) {
    document.getElementById('attendanceResult').innerText = 'Error: ' + err.message;
  }
});
