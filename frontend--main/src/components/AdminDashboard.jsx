import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css'; // External CSS for styling

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(''); // State for the admin's name
  const [stats, setStats] = useState({ totalStudents: 0, totalStaff: 0, pendingNotifications: 0 });

  useEffect(() => {
    // Fetch admin details from the backend
    axios.get('/api/admin-details')
      .then(response => {
        setUserName(response.data.name);
      })
      .catch(error => {
        console.error('Error fetching admin details:', error);
      });

    // Fetch statistics for students, staff, and notifications
    axios.get('/api/admin-stats')
      .then(response => {
        setStats(response.data);
      })
      .catch(error => {
        console.error('Error fetching statistics:', error);
      });
  }, []);

  return (
    <div className="admin-dashboard-container">
      <header className="dashboard-header">
        <h1>Hello, {userName}! Welcome to your Dashboard</h1>
        <p className="dashboard-subtitle">Manage everything in one place with ease and elegance</p>
      </header>

      <section className="dashboard-content">
        <div className="button-grid">
          <button 
            className="dashboard-button manage-students" 
            onClick={() => navigate('/manage-students')}
          >
            <i className="fas fa-user-graduate"></i>
            Manage Students
          </button>

          <button 
            className="dashboard-button manage-staff" 
            onClick={() => navigate('/manage-staff')}
          >
            <i className="fas fa-users"></i>
            Manage Staff
          </button>

          <button 
            className="dashboard-button notifications" 
            onClick={() => navigate('/notifications')}
          >
            <i className="fas fa-bell"></i>
            Notifications
          </button>

          <button 
            className="dashboard-button gallery" 
            onClick={() => navigate('/gallery')}
          >
            <i className="fas fa-images"></i>
            Gallery
          </button>

          <button 
            className="dashboard-button events" 
            onClick={() => navigate('/events')}
          >
            <i className="fas fa-calendar-alt"></i>
            Events
          </button>

          <button 
            className="dashboard-button fee-overview" 
            onClick={() => navigate('/fee-overview')}
          >
            <i className="fas fa-money-check-alt"></i>
            Fee Overview
          </button>

          <button 
            className="dashboard-button profile" 
            onClick={() => navigate('/profile')}
          >
            <i className="fas fa-user-circle"></i>
            Profile
          </button>
        </div>

        <div className="info-panel">
          <h2>Quick Stats</h2>
          <ul>
            <li><strong>Total Students:</strong> {stats.totalStudents}</li>
            <li><strong>Total Staff:</strong> {stats.totalStaff}</li>
            <li><strong>Pending Notifications:</strong> {stats.pendingNotifications}</li>
          </ul>
        </div>

        <div className="image-section">
          <img 
            src="/path/to/your/image1.jpg" 
            alt="Gallery Image 1" 
            className="dashboard-image" 
          />
          <img 
            src="/path/to/your/image2.jpg" 
            alt="Gallery Image 2" 
            className="dashboard-image" 
          />
        </div>
      </section>

      <footer className="dashboard-footer">
        <p>© 2024 Msingi Bora Sigor Academy. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
