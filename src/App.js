import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './Assets/styles/App.css';
import logo from './Assets/Images/WhiteML_Logo-w-tag-vector.svg';
import OrderList from './components/OrderList.js';
import Login from './Pages/Login.js';
import Dashboard from './Pages/Dashboard.js';


function App() {
  const orders = [
    { id: '334', user: 'User #2222', part: 'DX 544 XLT', status: 'Processing', quantity: 5 },
    { id: '335', user: 'User #2223', part: 'Engine Oil', status: 'Completed', quantity: 3 },
    { id: '336', user: 'User #2224', part: 'Filter', status: 'Pending', quantity: 2 },
    { id: '337', user: 'User #2225', part: 'Brake Pads', status: 'Processing', quantity: 1 },
    { id: '338', user: 'User #2226', part: 'Transmission Fluid', status: 'Completed', quantity: 4 },
    { id: '339', user: 'User #2227', part: 'Coolant', status: 'Completed', quantity: 6 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return '#ffa500';
      case 'Completed':
        return '#28a745';
      case 'Pending':
        return '#ffa500';
      default:
        return 'black';
    }
  };

  const getTotalsByStatus = () => {
    const counts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(counts)
      .map(([status, count]) => `${status} (${count})`)
      .join(', ');
  };

  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
