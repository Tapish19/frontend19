document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const attendanceForm = document.getElementById('attendanceForm');

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(registerForm);

      try {
        const res = await fetch('http://localhost:3000/Register', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        document.getElementById('regResult').innerText = data.message;
      } catch (err) {
        document.getElementById('regResult').innerText = 'Error: ' + err.message;
      }
    });
  }

  if (attendanceForm) {
    attendanceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(attendanceForm);

      try {
        const res = await fetch('http://localhost:3000/mark-attendance', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        document.getElementById('attendanceResult').innerText = data.message;
      } catch (err) {
        document.getElementById('attendanceResult').innerText = 'Error: ' + err.message;
      }
    });
  }
});
