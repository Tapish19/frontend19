document.addEventListener('DOMContentLoaded', () => {
  // Registration form handler
  const registerForm = document.getElementById('registerForm');
  const regResult = document.getElementById('regResult');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (regResult) regResult.innerText = "Registering...";
      const formData = new FormData(registerForm);
      try {
        const res = await fetch('http://localhost:3000/Registration', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (regResult) regResult.innerText = data.message || "Registration complete!";
        registerForm.reset();
      } catch (err) {
        if (regResult) regResult.innerText = '⚠️ Error: ' + err.message;
      }
    });
  }

  // Attendance form handler
  const attendanceForm = document.getElementById('attendanceForm');
  if (attendanceForm) {
    attendanceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(attendanceForm);

      const spinner = document.getElementById('loadingSpinner');
      const result = document.getElementById('attendanceResult');

      // Show loading spinner
      if (spinner) spinner.style.display = 'block';
      if (result) result.innerText = '';

      try {
        const res = await fetch('http://localhost:3000/mark-attendance', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        console.log("Attendance Response:", data); // 🟡 Debugging output

        const matched = data?.data?.matched;
if (matched === true) {
  if (result) result.innerText = "✅ Person verified";
} else if (matched === false) {
  if (result) result.innerText = "❌ Face not matched";
} else {
  if (result) result.innerText = "❓ Unexpected response";
}
      } catch (err) {
        if (result) result.innerText = '⚠️ Error: ' + err.message;
      } finally {
        if (spinner) spinner.style.display = 'none';
      }
    });
  }
});
