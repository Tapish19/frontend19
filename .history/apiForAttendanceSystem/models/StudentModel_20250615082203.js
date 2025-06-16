import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

const studentSchema = new mongoose.Schema({
    Id: {
        type: Number,
        unique: true,
    },
    enrollment_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profileImage: {
        type: String,
        required: true
    },
    course: { // <-- Add this field
        type: String,
        required: true
    }
}, { timestamps: true });

studentSchema.plugin(AutoIncrement, { inc_field: 'Id', start_seq: 1 });

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

export default Student;
