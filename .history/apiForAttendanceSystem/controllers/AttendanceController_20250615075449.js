import axios from 'axios';
import Attendance from '../models/AttendanceModel.js';
import QueryFaces from '../models/QueryFacesModel.js';
import dotenv from 'dotenv';
import multer from 'multer';
import cloudinary from 'cloudinary';

dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

cloudinary.v2.config({
    cloud_name: process.env.Cloud_name,
    api_key: process.env.API_key,
    api_secret: process.env.API_secret
});

export const markAttendance = async (req, res) => {
    try {
        const { id, name, course } = req.body;
       const uploadedFile = req.files && req.files.length > 0 ? req.files[0] : null;
if (!uploadedFile) {
    return res.status(400).json({ message: "No file uploaded" });
}
const image = uploadedFile.buffer.toString('base64'); // Convert image buffer to base64

        // Upload image to Cloudinary
        const uploadResponse = await cloudinary.v2.uploader.upload(`data:image/jpeg;base64,${image}`);

        // Automatically set the current time and date
        const time = new Date().toLocaleTimeString();
        const date = new Date().toLocaleDateString();

        // Prepare payload for external API
        const payload = {
            id: id,
            name: name,
            image: uploadResponse.secure_url, // Send Cloudinary image URL
            course: course
        };

        // Log the payload
        console.log('Payload:', payload);

        // Call external API using credentials from .env file
        const response = await axios.post(process.env.EXTERNAL_API_URL, payload);

        // Save attendance record to the database
        const attendance = new Attendance({ time, date, id, name, image: uploadResponse.secure_url, course });
        await attendance.save();

        // Save query face record to the database
        const queryFace = new QueryFaces({ time, date, id, name, image: uploadResponse.secure_url, course });
        await queryFace.save();

        res.status(200).json({ message: 'Attendance marked successfully', data: response.data });
    } catch (error) {
        res.status(500).json({ message: 'Error marking attendance', error: error.message });
    }
};

export { upload };