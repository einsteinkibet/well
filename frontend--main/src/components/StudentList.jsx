// src/components/StudentList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentList = ({ onSelectStudent }) => {
    const [students, setStudents] = useState([]);
    const [gradeFilter, setGradeFilter] = useState('');
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null); // State for error handling

    useEffect(() => {
        fetchStudents();
    }, [gradeFilter]);

    const fetchStudents = async () => {
        setLoading(true); // Set loading to true
        setError(null); // Reset any previous error
        try {
            const response = await axios.get('https://back-end2-dl6sdah86-stanoos-projects.vercel.app/students', {
                params: { grade: gradeFilter }
            });
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students', error);
            setError('Failed to fetch students. Please try again.'); // Set error message
        } finally {
            setLoading(false); // Set loading to false regardless of success or failure
        }
    };

    const handleGradeFilterChange = (e) => {
        setGradeFilter(e.target.value);
    };

    return (
        <div>
            <h2>Students</h2>
            <input
                type="text"
                placeholder="Filter by grade"
                value={gradeFilter}
                onChange={handleGradeFilterChange}
            />
            {loading ? (
                <p>Loading students...</p> // Loading message
            ) : error ? (
                <p>{error}</p> // Display error message if there was an error
            ) : students.length === 0 ? (
                <p>No students found.</p> // Message when no students are found
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Admission Number</th>
                            <th>Balance</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id} onClick={() => onSelectStudent(student)}>
                                <td>{student.name}</td>
                                <td>{student.admission_number}</td>
                                <td>{student.balance.toFixed(2)}</td> {/* Format balance */}
                                <td>{student.grade}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StudentList;
