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
        required: false
    },
    id: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: false
    }
});

const QueryFaces = mongoose.model('QueryFaces', queryFacesSchema);

export default QueryFaces;
