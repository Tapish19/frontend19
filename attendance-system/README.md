# Attendance System

Full-stack attendance application with:

- `frontend/` — React frontend for student registration, student lists, and teacher-reviewed attendance confirmation.
- `../apiForAttendanceSystem/` — Node.js API for registration and attendance persistence.
- `../faceapi-master/` — Django face-recognition service used by the Node API.

## Attendance Flow

1. The React frontend uploads a class photo to the Node API's `POST /mark-attendance` endpoint.
2. The Node API sends the photo to the configured Django face-recognition service.
3. The frontend shows detected face crops, guessed names, confidence scores, and bounding boxes without writing attendance records yet.
4. A teacher confirms/unchecks matches and can manually add missed students.
5. The frontend posts the final list to `POST /confirm-attendance`, and only then does the Node API write attendance records.

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Node API Setup

```bash
cd ../apiForAttendanceSystem
npm install
npm start
```

Configure the Node API environment with MongoDB, Cloudinary credentials, and `EXTERNAL_API_URL` for the Django face-recognition endpoint.

## Django Face API Setup

```bash
cd ../faceapi-master
pip install -r requirements.txt
python manage.py runserver
```
