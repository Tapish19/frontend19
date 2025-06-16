# Face Recognition API

This project is a face recognition API built using Django and InsightFace. It allows you to process images, extract face embeddings, and match faces against a database of known faces stored in MongoDB.

## Features

- Face detection and embedding extraction using InsightFace.
- Face matching using Faiss for efficient similarity search.
- Attendance tracking based on face recognition.
- REST API endpoints for processing images and retrieving student data.

## Requirements

- Python 3.8+
- MongoDB
- The required Python packages listed in `requirements.txt`.

## Setup

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/face-recognition-api.git
    cd face-recognition-api
    ```

2. **Create a virtual environment and activate it:**
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. **Install the required packages:**
    ```sh
    pip install -r requirements.txt
    ```

4. **Set up environment variables:**
    Create a `.env` file in the project root directory and add your MongoDB connection URL:
    ```properties
    MONGO_URL=mongodb+srv://username:password@cluster0.mongodb.net/
    ```

5. **Run database migrations:**
    ```sh
    python manage.py migrate
    ```

6. **Start the Django development server:**
    ```sh
    python manage.py runserver
    ```

## API Endpoints

- **Process Image:**
    - **URL:** `/api/process-face-image/`
    - **Method:** `POST`
    - **Description:** Processes an image URL, extracts face embeddings, and matches against known faces.
    - **Request Body:**
        ```json
        {
            "image": "http://example.com/image.jpg"
        }
        ```
    - **Response:**
        ```json
        {
            "message": "Match found: John Doe (Similarity: 0.95)"
        }
        ```

- **Get Attendance:**
    - **URL:** `/api/attendance/`
    - **Method:** `GET`
    - **Description:** Retrieves all attendance records.
    - **Response:**
        ```json
        [
            {
                "name": "John Doe",
                "enrollment_number": "12345",
                "status": "present",
                "date": "2025-02-11"
            },
            ...
        ]
        ```

- **Get Student Data:**
    - **URL:** `/api/students/`
    - **Method:** `GET`
    - **Description:** Retrieves all student data from MongoDB.
    - **Response:**
        ```json
        [
            {
                "id": "60d5f9b8e1b8f5b8e1b8f5b8",
                "name": "John Doe",
                "enrollment_number": "12345",
                "email": "john.doe@example.com",
                "createdAt": "2025-02-11T18:19:49Z",
                "updatedAt": "2025-02-11T18:19:49Z",
                "Id": "12345",
                "course": "Computer Science"
            },
            ...
        ]
        ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
