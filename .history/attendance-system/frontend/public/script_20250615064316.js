document.addEventListener('DOMContentLoaded', () => {
  const attendanceForm = document.getElementById('attendanceForm');

  if (attendanceForm) {
    attendanceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(attendanceForm);

      const spinner = document.getElementById('loadingSpinner');
      const result = document.getElementById('attendanceResult');

      // Show loading spinner
      spinner.style.display = 'block';
      result.innerText = '';

      try {
        const res = await fetch('http://localhost:3000/mark-attendance', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();

        if (
          data.verified === true ||
          (typeof data.message === "string" && data.message.toLowerCase().includes("verified"))
        ) {
          result.innerText = "✅ Person verified";
        } else {
          result.innerText = "❌ Not verified";
        }
      } catch (err) {
        result.innerText = '⚠️ Error: ' + err.message;
      } finally {
        spinner.style.display = 'none';
      }
    });
  }
});
