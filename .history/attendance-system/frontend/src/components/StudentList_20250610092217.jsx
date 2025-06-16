import React, { useEffect, useState } from 'react';
import { fetchStudents } from '../api/djangoApi'; // Adjust the import based on your API structure

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getStudents = async () => {
            try {
                const data = await fetchStudents();
                setStudents(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getStudents();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Registered Students</h2>
            <ul>
                {students.map(student => (
                    <li key={student.enrollment_id}>
                        {student.name} - {student.course}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentList;