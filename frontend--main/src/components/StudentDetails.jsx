// src/components/StudentDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentDetails = ({ student }) => {
    const [payments, setPayments] = useState([]);
    const [newPayment, setNewPayment] = useState({
        amount: '',
        date: '',
        method: 'phone'
    });

    useEffect(() => {
        fetchPayments();
    }, [student]);

    const fetchPayments = async () => {
        try {
            const response = await axios.get('https://back-end2-dl6sdah86-stanoos-projects.vercel.app/payments', {
                params: { admission_number: student.admission_number }
            });
            setPayments(response.data);
        } catch (error) {
            console.error('Error fetching payments', error);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://back-end2-dl6sdah86-stanoos-projects.vercel.app/payments', {
                ...newPayment,
                admission_number: student.admission_number
            });
            fetchPayments(); // Refresh payments list after adding new payment
            setNewPayment({ amount: '', date: '', method: 'phone' }); // Reset form
        } catch (error) {
            console.error('Error adding payment', error);
        }
    };

    return (
        <div>
            <h2>{student.name}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Payment Method</th>
                        <th>Current Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => (
                        <tr key={payment.id}>
                            <td>{payment.date}</td>
                            <td>{payment.amount}</td>
                            <td>{payment.method}</td>
                            <td>{student.balance}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3>Add Payment</h3>
            <form onSubmit={handlePaymentSubmit}>
                <input
                    type="number"
                    placeholder="Amount"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    required
                />
                <input
                    type="date"
                    value={newPayment.date}
                    onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                    required
                />
                <select
                    value={newPayment.method}
                    onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                >
                    <option value="phone">Phone</option>
                    <option value="cash">Cash</option>
                    <option value="inkind">Inkind</option>
                </select>
                <button type="submit">Add Payment</button>
            </form>
        </div>
    );
};

export default StudentDetails;
