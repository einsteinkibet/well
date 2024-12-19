import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BursarDashboard = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({
    amount: '',
    date: '',
    method: 'cash',
  });

  useEffect(() => {
    // Fetch students and payments when the component is mounted
    const fetchData = async () => {
      try {
        const studentsResponse = await axios.get('https://backend1-nbbb.onrender.com/users?role=Student');
        setStudents(studentsResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Fetch payments for the selected student
  const fetchPayments = async (studentId) => {
    try {
      const paymentsResponse = await axios.get(`https://backend1-nbbb.onrender.com/payments?studentId=${studentId}`);
      setPayments(paymentsResponse.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle adding a new payment
  const handleAddPayment = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://backend1-nbbb.onrender.com/payments', {
        ...newPayment,
        studentId: selectedStudent.id,
      });
      alert('Payment added successfully!');
      fetchPayments(selectedStudent.id); // Refresh payments after adding new one
      setNewPayment({ amount: '', date: '', method: 'cash' }); // Reset payment form
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate remaining balance after a payment
  const calculateRemainingBalance = (payments) => {
    return payments.reduce((balance, payment) => balance - payment.amount, selectedStudent.balance);
  };

  return (
    <div>
      <h2>Bursar Dashboard</h2>

      {/* Student List */}
      <h3>Student List</h3>
      <ul>
        {students.map((student) => (
          <li key={student.id} onClick={() => {
            setSelectedStudent(student);
            fetchPayments(student.id); // Fetch payments when a student is selected
          }}>
            {student.name} - Grade: {student.grade} - Balance: {student.balance}
          </li>
        ))}
      </ul>

      {/* Selected Student's Payment Details */}
      {selectedStudent && (
        <>
          <h3>Payments for {selectedStudent.name}</h3>
          <table>
            <thead>
              <tr>
                <th>Payment Date</th>
                <th>Amount</th>
                <th>Remaining Balance</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => {
                // Calculate remaining balance after each payment
                const remainingBalance = payments.slice(0, index + 1).reduce((balance, p) => balance - p.amount, selectedStudent.balance);
                return (
                  <tr key={payment.id}>
                    <td>{payment.date}</td>
                    <td>{payment.amount}</td>
                    <td>{remainingBalance}</td>
                    <td>{payment.method}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Add New Payment */}
          <h3>Add Payment for {selectedStudent.name}</h3>
          <form onSubmit={handleAddPayment}>
            <input
              name="amount"
              type="number"
              placeholder="Amount"
              value={newPayment.amount}
              onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
              required
            />
            <input
              name="date"
              type="date"
              value={newPayment.date}
              onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
              required
            />
            <select
              name="method"
              value={newPayment.method}
              onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
            >
              <option value="cash">Cash</option>
              <option value="paybill">Paybill</option>
              <option value="inkind">In-kind</option>
            </select>
            <button type="submit">Add Payment</button>
          </form>
        </>
      )}

      {/* Summary and Term Separation */}
      {selectedStudent && (
        <>
          <h3>Term Summary for {selectedStudent.name}</h3>
          {/* Example term separation logic */}
          <hr />
          <h4>Term 1</h4>
          <p>Prepayment/Arrears: {selectedStudent.term1Balance}</p>
          <hr />
          <h4>Term 2</h4>
          <p>Prepayment/Arrears: {selectedStudent.term2Balance}</p>
          {/* Add more terms as needed */}
        </>
      )}
    </div>
  );
};

export default BursarDashboard;
