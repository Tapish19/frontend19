# Attendance System

This project is a web application that integrates a Django backend for face recognition and a Node.js backend for attendance management. The frontend is built using React and provides a user-friendly interface for interacting with both backends.

## Project Structure

```
attendance-system
├── frontend
│   ├── public
│   │   └── index.html
│   ├── src
│   │   ├── api
│   │   │   ├── djangoApi.js
│   │   │   └── nodeApi.js
│   │   ├── components
│   │   │   ├── AttendanceForm.jsx
│   │   │   ├── StudentRegistration.jsx
│   │   │   └── StudentList.jsx
│   │   ├── pages
│   │   │   ├── Home.jsx
│   │   │   └── NotFound.jsx
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── styles
│   │       └── main.css
│   ├── package.json
│   └── README.md
├── faceapi-backend      # Your Django backend (existing)
├── node-backend         # Your Node.js backend (existing)
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB (for Node.js backend)
- Python (for Django backend)
- Django and required packages (for Django backend)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/attendance-system.git
   cd attendance-system
   ```

2. Set up the Django backend:

   - Navigate to the `faceapi-backend` directory.
   - Install the required Python packages:

     ```sh
     pip install -r requirements.txt
     ```

   - Run the Django server:

     ```sh
     python manage.py runserver
     ```

3. Set up the Node.js backend:

   - Navigate to the `node-backend` directory.
   - Install the required Node.js packages:

     ```sh
     npm install
     ```

   - Run the Node.js server:

     ```sh
     npm start
     ```

4. Set up the frontend:

   - Navigate to the `frontend` directory.
   - Install the required Node.js packages:

     ```sh
     npm install
     ```

   - Run the frontend application:

     ```sh
     npm start
     ```

### Usage

- Access the application in your web browser at `http://localhost:3000`.
- Use the provided forms to register students and mark attendance.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

### License

This project is licensed under the MIT License. See the LICENSE file for more details.