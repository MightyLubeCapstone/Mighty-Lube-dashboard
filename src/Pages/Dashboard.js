import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Assets/styles/login.css';
import OrderList from '../components/OrderList';
import NavbarPopup from '../components/NavbarPopup';
import logo from '../Assets/Images/WhiteML_Logo-w-tag-vector.svg';
import { useOrders } from '../hooks/useOrders';
/*
Notes:
- Currently we import a JSON to fill in the table below. The table is generated using the OrderList.js file, which takes in the JSON data and creates a table.
- Using OrderList.js will make our life much easier, we just need to make a fetch request to an API that provides the data. The fetch can be set to a variable and then barely any code needs to change
- The table is generated here, with the rest of the page elements like logo, navigation, and settings. The logout button is created within the orders table
*/



function Dashboard() {
  const navigate = useNavigate();
  const [adminPopupOpen, setAdminPopupOpen] = useState(false);
  const [settingsPopupOpen, setSettingsPopupOpen] = useState(false);
  const { orders, loading, error } = useOrders();

  const handleLogout = () => {
    // Here you would typically clear any authentication tokens
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
    // Main dashboard container
    <div id="mainDiv">

      {/* Div for the table */}
      <div className="dashboard-content">

        {/* Summary card */}
        <div className="summary-card">
          <div style={{ margin: '0 20px' }}>
            <h2>Summary</h2>
            <p>Total Orders: {orders.length}</p>
            <p>Total Parts Ordered: {orders.reduce((sum, order) => sum + order.quantity, 0)}</p>
            <p>Orders by Status: Processing (2), Completed (3), Pending (1)</p>
          </div>
        </div>

        <header className="dashboard-header">
          <h1>Dashboard</h1>

          {/* Logo container */}
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


        <main id="tblDashboard">
          <OrderList orders={orders} />
        </main>

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

    </div>
  );
}

export default Dashboard;