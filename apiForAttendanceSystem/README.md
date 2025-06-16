# Face API

This project is a face recognition API that allows for student registration, attendance marking using AI, and image processing with Cloudinary.

## Features

- Student registration with profile image upload
- Attendance marking using AI
- Image upload to Cloudinary
- Integration with external API for face recognition

## Setup

### Prerequisites

- Node.js
- MongoDB
- Cloudinary account

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/face-api.git
   cd face-api
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```properties
   PORT = 3000
   MONGODB_URI = mongodb+srv://<username>:<password>@cluster0.mongodb.net/
   Cloud_name = <your_cloudinary_cloud_name>
   API_key = <your_cloudinary_api_key>
   API_secret = <your_cloudinary_api_secret>
   JWT_SECRET = <your_jwt_secret>
   EXTERNAL_API_URL = http://127.0.0.1:8000/api/process-face-image/
   ```

4. Start the server:

   ```sh
   npm start
   ```

## Usage

### Register a Student

To register a student, send a POST request to `/Registration` with the following form data:

- `name`: Student's name
- `enrollment_id`: Student's enrollment ID
- `email`: Student's email
- `course`: Student's course
- `ProfileImage`: Path to the student's profile image

Example `curl` command:

```sh
curl -X POST http://localhost:3000/Registration \
-H "Content-Type: multipart/form-data" \
-F "name=John Doe" \
-F "enrollment_id=12345" \
-F "email=johndoe@example.com" \
-F "course=Computer Science" \
-F "ProfileImage=@/path/to/image.jpg"
```

### Mark Attendance

To mark attendance using AI, send a POST request to `/mark-attendance` with the following form data:

- `image`: Path to the image file

Example `curl` command:

```sh
curl -X POST http://localhost:3000/mark-attendance \
-H "Content-Type: multipart/form-data" \
-F "image=@/path/to/image.jpg"
```

### Get All Students

To retrieve all registered students, send a GET request to `/students`.

Example `curl` command:

```sh
curl -X GET http://localhost:3000/students
```

## License

This project is licensed under the MIT License.
