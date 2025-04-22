import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Assets/styles/login.css';
import OrderList from '../components/OrderList';
import NavbarPopup from '../components/NavbarPopup';
import logo from '../Assets/Images/ML_Logo-w-tag-vector.svg';

function Dashboard() {
  const navigate = useNavigate();
  const [adminPopupOpen, setAdminPopupOpen] = useState(false);
  const [settingsPopupOpen, setSettingsPopupOpen] = useState(false);

  const orders = [
    { id: '334', user: 'User #2222', part: 'DX 544 XLT', status: 'Processing', quantity: 5 },
    { id: '335', user: 'User #2223', part: 'Engine Oil', status: 'Completed', quantity: 3 },
    { id: '336', user: 'User #2224', part: 'Filter', status: 'Pending', quantity: 2 },
    { id: '337', user: 'User #2225', part: 'Brake Pads', status: 'Processing', quantity: 1 },
    { id: '338', user: 'User #2226', part: 'Transmission Fluid', status: 'Completed', quantity: 4 },
    { id: '339', user: 'User #2227', part: 'Coolant', status: 'Completed', quantity: 6 },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  const openAdminPopup = (e) => {
    e.preventDefault();
    setAdminPopupOpen(true);
  };

  const closeAdminPopup = () => {
    setAdminPopupOpen(false);
  };

  const openSettingsPopup = (e) => {
    e.preventDefault();
    setSettingsPopupOpen(true);
  };

  const closeSettingsPopup = () => {
    setSettingsPopupOpen(false);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo-container">
          <img src={logo} alt="Mighty Lube Logo" className="logo" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <nav className="nav-links">
            <a href="#admin" onClick={openAdminPopup}>Admin</a>
            <a href="#settings" onClick={openSettingsPopup}>Settings</a>
          </nav>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>
      <div className="dashboard-content">
        <div className="summary-card">
          <div style={{ margin: '0 20px' }}>
            <h2>Summary</h2>
            <p>Total Orders: {orders.length}</p>
            <p>Total Parts Ordered: {orders.reduce((sum, order) => sum + order.quantity, 0)}</p>
            <p>Orders by Status: Processing (2), Completed (3), Pending (1)</p>
          </div>
        </div>
        <div className="order-list-card">
          <OrderList orders={orders} />
        </div>
      </div>

      {/* Admin Popup */}
      <NavbarPopup 
        isOpen={adminPopupOpen} 
        onClose={closeAdminPopup} 
        title="Admin Panel"
      >
        <div style={{ minHeight: '300px' }}>
          <p>Admin functionality goes here.</p>
          <ul>
            <li>User Management</li>
            <li>Role Permissions</li>
            <li>System Configuration</li>
          </ul>
        </div>
      </NavbarPopup>

      {/* Settings Popup */}
      <NavbarPopup 
        isOpen={settingsPopupOpen} 
        onClose={closeSettingsPopup} 
        title="Settings"
      >
        <div style={{ minHeight: '300px' }}>
          <p>Settings options go here.</p>
          <ul>
            <li>Account Settings</li>
            <li>Notification Preferences</li>
            <li>Theme Options</li>
            <li>Language Settings</li>
          </ul>
        </div>
      </NavbarPopup>
    </div>
  );
}

export default Dashboard;