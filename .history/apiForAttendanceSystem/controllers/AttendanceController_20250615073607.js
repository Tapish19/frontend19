export const markAttendance = async (file, req, res) => {
    try {
        const { id, name, course } = req.body;
        const image = file.buffer.toString('base64');

        const uploadResponse = await cloudinary.v2.uploader.upload(`data:image/jpeg;base64,${image}`);

        const time = new Date().toLocaleTimeString();
        const date = new Date().toLocaleDateString();

        const payload = {
            id,
            name,
            image: uploadResponse.secure_url,
            course
        };

        const response = await axios.post(process.env.EXTERNAL_API_URL, payload);

        const attendance = new Attendance({ time, date, id, name, image: uploadResponse.secure_url, course });
        await attendance.save();

        const queryFace = new QueryFaces({ time, date, id, name, image: uploadResponse.secure_url, course });
        await queryFace.save();

        res.status(200).json({ message: 'Attendance marked successfully', data: response.data });
    } catch (error) {
        res.status(500).json({ message: 'Error marking attendance', error: error.message });
    }
};
