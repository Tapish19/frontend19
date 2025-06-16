<!DOCTYPE html>
<html>
<head>
  <title>Mark Attendance</title>
</head>
<body>
  <h2>Mark Attendance</h2>
  <form id="attendanceForm" enctype="multipart/form-data">
    <label>Student ID:</label>
    <input type="text" name="id" required><br>

    <label>Student Name:</label>
    <input type="text" name="name" required><br>

    <label>Course:</label>
    <input type="text" name="course" required><br>

    <label>Upload Image:</label>
    <input type="file" name="image" accept="image/*" required><br>

    <button type="submit">Submit</button>
  </form>

  <p id="attendanceMessage"></p>

  <script>
    document.getElementById('attendanceForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);

      try {
        const res = await fetch('/mark-attendance', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        document.getElementById('attendanceMessage').innerText = data.message;
      } catch (err) {
        document.getElementById('attendanceMessage').innerText = 'Error: ' + err.message;
      }
    });
  </script>
</body>
</html>
