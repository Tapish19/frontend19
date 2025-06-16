import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    time: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false // Make optional
    },
    id: {
        type: String,
        required: false // Make optional
    },
    image: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: false // Make optional
    }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
