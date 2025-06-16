# Frontend Project Documentation

## Overview

This is the frontend application for the Attendance System, which interacts with both a Django backend for face API functionalities and a Node.js backend for attendance management and student registration.

## Project Structure

The frontend project is structured as follows:

```
frontend
├── public
│   └── index.html          # Main HTML file
├── src
│   ├── api
│   │   ├── djangoApi.js    # API calls for Django backend
│   │   └── nodeApi.js      # API calls for Node.js backend
│   ├── components
│   │   ├── AttendanceForm.jsx  # Component for marking attendance
│   │   ├── StudentRegistration.jsx  # Component for registering students
│   │   └── StudentList.jsx  # Component for displaying student list
│   ├── pages
│   │   ├── Home.jsx         # Home page component
│   │   └── NotFound.jsx     # 404 Not Found page component
│   ├── App.jsx              # Main application component
│   ├── index.js             # Entry point for the React application
│   └── styles
│       └── main.css         # Main CSS styles
├── package.json             # npm configuration file
└── README.md                # Frontend project documentation
```

## Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd attendance-system/frontend
   ```

2. **Install Dependencies:**
   Make sure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Run the Application:**
   Start the development server:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`.

## Usage

- Navigate to the home page to access the attendance marking and student registration features.
- Use the forms provided in the components to interact with the backend APIs.
- The application will handle API calls to both the Django and Node.js backends as needed.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.