<!DOCTYPE html>
<html>
<head>
  <title>Register Student</title>
</head>
<body>
  <h2>Student Registration</h2>
  <form id="registerForm" enctype="multipart/form-data">
    <input name="name" placeholder="Full Name" required><br>
    <input name="enrollment_id" placeholder="Enrollment ID" required><br>
    <input name="email" type="email" placeholder="Email" required><br>
    <input name="course" placeholder="Course" required><br>
    <input name="ProfileImage" type="file" accept="image/*" required><br>
    <button type="submit">Register</button>
  </form>

  <p id="registerMsg"></p>

  <script>
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);

      try {
        const res = await fetch('/Registration', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        document.getElementById('registerMsg').innerText = data.message;
        e.target.reset();
      } catch (err) {
        document.getElementById('registerMsg').innerText = 'Error: ' + err.message;
      }
    });
  </script>
</body>
</html>
