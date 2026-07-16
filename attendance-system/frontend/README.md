# Attendance System Frontend

React frontend for the Attendance System. The UI talks to the Node.js API in `../../apiForAttendanceSystem`, which in turn calls the Django face-recognition service configured by the backend's `EXTERNAL_API_URL`.

## Structure

```
frontend
├── public
│   ├── favicon.svg
│   └── index.html
├── src
│   ├── api
│   │   └── nodeApi.js
│   ├── components
│   │   ├── AttendanceForm.jsx
│   │   ├── StudentList.jsx
│   │   └── StudentRegistration.jsx
│   ├── App.css
│   ├── App.jsx
│   └── index.js
├── package.json
└── README.md
```

## Attendance Review Flow

1. Upload a class photo from **Mark Attendance**.
2. The frontend calls `POST /mark-attendance` to detect faces and receive match candidates.
3. Teachers review face crops, guessed names, confidence scores, and bounding boxes.
4. Teachers can uncheck incorrect matches or manually add missed students.
5. The frontend calls `POST /confirm-attendance` only when the teacher confirms the final list.

## Setup

```bash
npm install
npm start
```

Set `REACT_APP_NODE_API_URL` if the Node API is not running at `http://localhost:3000`.
