import cloudinary from 'cloudinary';
import axios from 'axios';
import Attendance from '../models/AttendanceModel.js';
import QueryFaces from '../models/QueryFaceModel.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const markAttendance = async (file, req, res) => {
  try {
    const { id, name, course } = req.body;
    const imageBase64 = file.buffer.toString('base64');

    // Upload to Cloudinary (optional)
    const cloudResult = await cloudinary.v2.uploader.upload(`data:image/jpeg;base64,${imageBase64}`);

    const time = new Date().toLocaleTimeString();
    const date = new Date().toLocaleDateString();

    const payload = {
      id,
      name,
      image: cloudResult.secure_url,
      course
    };

    const response = await axios.post(process.env.EXTERNAL_API_URL, payload);

    const attendance = new Attendance({
      id,
      name,
      image: cloudResult.secure_url,
      time,
      date,
      course
    });
    await attendance.save();

    const queryFace = new QueryFaces({
      id,
      name,
      image: cloudResult.secure_url,
      time,
      date,
      course
    });
    await queryFace.save();

    return response.data;
  } catch (error) {
    console.error('Error in markAttendance:', error.message);
    throw error;
  }
};

export { upload };
