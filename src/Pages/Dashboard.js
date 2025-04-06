import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Assets/styles/login.css';
import OrderList from '../components/OrderList';
import logo from '../Assets/Images/WhiteML_Logo-w-tag-vector.svg';

function Dashboard() {
  const navigate = useNavigate();
  const orders = [
    { id: '334', user: 'User #2222', part: 'DX 544 XLT', status: 'Processing', quantity: 5 },
    { id: '335', user: 'User #2223', part: 'Engine Oil', status: 'Completed', quantity: 3 },
    { id: '336', user: 'User #2224', part: 'Filter', status: 'Pending', quantity: 2 },
    { id: '337', user: 'User #2225', part: 'Brake Pads', status: 'Processing', quantity: 1 },
    { id: '338', user: 'User #2226', part: 'Transmission Fluid', status: 'Completed', quantity: 4 },
    { id: '339', user: 'User #2227', part: 'Coolant', status: 'Completed', quantity: 6 },
  ];

  const handleLogout = () => {
    // Here you would typically clear any authentication tokens
    navigate('/');
  };

  return (
    <div className="dashboard">
      <div className="logo-header">
        <div className="logo-container">
          <img src={logo} alt="Mighty Lube Logo" className="logo" />
        </div>
        <nav className="nav-links">
          <a href="#orders">Orders</a>
          <a href="#settings">Settings</a>
        </nav>
      </div>
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </header>
        <main>
          <OrderList orders={orders} />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;