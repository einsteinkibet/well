import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PaymentTable from './PaymentTable';  // Importing the new reusable component

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchStudentsAndAssignments = async () => {
      try {
        const studentsResponse = await axios.get('https://backend1-nbbb.onrender.com/users?role=Student');
        const assignmentsResponse = await axios.get('https://backend1-nbbb.onrender.com/assignments');
        setStudents(studentsResponse.data);
        setAssignments(assignmentsResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudentsAndAssignments();
  }, []);

  const fetchPaymentsForStudent = async (studentId) => {
    try {
      const paymentsResponse = await axios.get(`https://backend1-nbbb.onrender.com/payments?studentId=${studentId}`);
      setPayments(paymentsResponse.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    fetchPaymentsForStudent(student.id);
  };

  const addAssignment = async (assignmentData) => {
    try {
      await axios.post('https://backend1-nbbb.onrender.com/assignments', assignmentData);
      alert('Assignment added');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Teacher Dashboard</h2>

      <h3>Manage Assignments</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addAssignment({ name: e.target.name.value, grade: e.target.grade.value });
        }}
      >
        <input name="name" placeholder="Assignment Name" required />
        <input name="grade" placeholder="Grade" required />
        <button type="submit">Add Assignment</button>
      </form>

      <h3>Student List:</h3>
      <ul>
        {students.map((student) => (
          <li key={student.id} onClick={() => handleStudentClick(student)}>
            {student.name} - {student.grade} - Balance: {student.balance}
          </li>
        ))}
      </ul>

      {selectedStudent && (
        <div>
          <h3>Payments for {selectedStudent.name}</h3>
          <PaymentTable payments={payments} balance={selectedStudent.balance} />
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
