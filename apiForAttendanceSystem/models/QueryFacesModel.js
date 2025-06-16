import mongoose from 'mongoose';

const queryFacesSchema = new mongoose.Schema({
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
        required: true
    },
    id: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    }
});

const QueryFaces = mongoose.model('QueryFaces', queryFacesSchema);

export default QueryFaces;
