// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './AdminDashboard.css'; // External CSS for styling

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [userName, setUserName] = useState(''); // State for the admin's name
//   const [stats, setStats] = useState({ totalStudents: 0, totalStaff: 0, pendingNotifications: 0 });

//   useEffect(() => {
//     // Fetch admin details from the backend
//     axios.get('/api/admin-details')
//       .then(response => {
//         setUserName(response.data.name);
//       })
//       .catch(error => {
//         console.error('Error fetching admin details:', error);
//       });

//     // Fetch statistics for students, staff, and notifications
//     axios.get('/api/admin-stats')
//       .then(response => {
//         setStats(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching statistics:', error);
//       });
//   }, []);

//   return (
//     <div className="admin-dashboard-container">
//       <header className="dashboard-header">
//         <h1>Hello, {userName}! Welcome to your Dashboard</h1>
//         <p className="dashboard-subtitle">Manage everything in one place with ease and elegance</p>
//       </header>

//       <section className="dashboard-content">
//         <div className="button-grid">
//           <button 
//             className="dashboard-button manage-students" 
//             onClick={() => navigate('/manage-students')}
//           >
//             <i className="fas fa-user-graduate"></i>
//             Manage Students
//           </button>

//           <button 
//             className="dashboard-button manage-staff" 
//             onClick={() => navigate('/manage-staff')}
//           >
//             <i className="fas fa-users"></i>
//             Manage Staff
//           </button>

//           <button 
//             className="dashboard-button notifications" 
//             onClick={() => navigate('/notifications')}
//           >
//             <i className="fas fa-bell"></i>
//             Notifications
//           </button>

//           <button 
//             className="dashboard-button gallery" 
//             onClick={() => navigate('/gallery')}
//           >
//             <i className="fas fa-images"></i>
//             Gallery
//           </button>

//           <button 
//             className="dashboard-button events" 
//             onClick={() => navigate('/events')}
//           >
//             <i className="fas fa-calendar-alt"></i>
//             Events
//           </button>

//           <button 
//             className="dashboard-button fee-overview" 
//             onClick={() => navigate('/fee-overview')}
//           >
//             <i className="fas fa-money-check-alt"></i>
//             Fee Overview
//           </button>

//           <button 
//             className="dashboard-button profile" 
//             onClick={() => navigate('/profile')}
//           >
//             <i className="fas fa-user-circle"></i>
//             Profile
//           </button>
//         </div>

//         <div className="info-panel">
//           <h2>Quick Stats</h2>
//           <ul>
//             <li><strong>Total Students:</strong> {stats.totalStudents}</li>
//             <li><strong>Total Staff:</strong> {stats.totalStaff}</li>
//             <li><strong>Pending Notifications:</strong> {stats.pendingNotifications}</li>
//           </ul>
//         </div>

//         <div className="image-section">
//           <img 
//             src="/path/to/your/image1.jpg" 
//             alt="Gallery Image 1" 
//             className="dashboard-image" 
//           />
//           <img 
//             src="/path/to/your/image2.jpg" 
//             alt="Gallery Image 2" 
//             className="dashboard-image" 
//           />
//         </div>
//       </section>

//       <footer className="dashboard-footer">
//         <p>© 2024 Msingi Bora Sigor Academy. All Rights Reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default AdminDashboard;


import React from 'react';
import './AdminDashboard.css'; // Import the CSS file for styling

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Dashboard</h2>
        <button className="sidebar-btn">View Students</button>
        <button className="sidebar-btn">Manage Profile</button>
        <button className="sidebar-btn">Filter Data</button>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Payments Overview */}
        <div className="top-overview">
          <div className="overview-card">
            <h3>Today's Payments</h3>
            <p>$2,500</p>
          </div>
          <div className="overview-card">
            <h3>Monthly Payments</h3>
            <p>$45,000</p>
          </div>
          <div className="overview-card">
            <h3>Term Payments</h3>
            <p>$150,000</p>
          </div>
        </div>

        {/* Main Call-to-Action Section */}
        <div className="middle-section">
          <div className="big-button">
            <h2>Manage Payments</h2>
            <p>Click to view, edit, or update payment details</p>
            <button className="action-btn">View Payments</button>
          </div>

          <div className="button-row">
            <button className="action-btn">View All Students</button>
            <button className="action-btn">Add Payment</button>
            <button className="action-btn">Daily Payments Report</button>
            <button className="action-btn">Monthly Payments Report</button>
            <button className="action-btn">Term Payments Report</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;