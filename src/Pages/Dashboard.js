import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Assets/styles/login.css';
import OrderList from '../components/OrderList';
import logo from '../Assets/Images/ML_Logo-w-tag-vector.svg';

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
    navigate('/');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo-container">
          <img src={logo} alt="Mighty Lube Logo" className="logo" />
        </div>
        <nav className="nav-links">
          <a href="#orders">Orders</a>
          <a href="#settings">Settings</a>
        </nav>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      <div className="dashboard-content">
        <div className="summary-card">
          <h2>Summary</h2>
          <p>Total Orders: {orders.length}</p>
          <p>Total Parts Ordered: {orders.reduce((sum, order) => sum + order.quantity, 0)}</p>
          <p>Orders by Status: Processing (2), Completed (3), Pending (1)</p>
        </div>
        <div className="order-list-card">
          <h2>Order List</h2>
          <OrderList orders={orders} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;