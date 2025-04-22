// This is the main entry point of the application
// It sets up the routing and imports global styles. This should remain fairly simple, import functions into here so they are used when running the app
// The export App allows index.js to use our functions and styles. For sake of simplicity, keep functions in their own files, and import them here. This will allow us to keep the code clean and organized

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './Assets/styles/main.css';
import Login from './Pages/Login.js';
import Dashboard from './Pages/Dashboard.js';

function App() {
  const [orders, setOrders] = useState([]);

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

  useEffect(() => {
    fetch('/orders.json')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders);
      })
      .catch((error) => {
        console.error('Error loading orders:', error);
      });
  }, []);

  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <Dashboard 
            orders={orders}
            getStatusColor={getStatusColor}
            getTotalsByStatus={getTotalsByStatus}
            />
          } 
        />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
