import React from 'react';
import { useNavigate } from 'react-router-dom';
import OrderList from '../components/OrderList';
import logo from '../Assets/Images/WhiteML_Logo-w-tag-vector.svg';
import { useOrders } from '../hooks/useOrders';
import { parseCartFromUserData } from '../hooks/useUsers';
import OrderTable from '../components/UseList';
import { useState, useEffect } from 'react';
/*
Notes:
- Currently we import a JSON to fill in the table below. The table is generated using the OrderList.js file, which takes in the JSON data and creates a table.
- Using OrderList.js will make our life much easier, we just need to make a fetch request to an API that provides the data. The fetch can be set to a variable and then barely any code needs to change
- The table is generated here, with the rest of the page elements like logo, navigation, and settings. The logout button is created within the orders table
*/



function Dashboard() {
    const [cart, setCart] = useState([]);
    useEffect(() => {
      fetch('/users.json')
        .then(res => res.json())
        .then(json => {
          const parsed = parseCartFromUserData(json);
          setCart(parsed);
        });
    }, []);
  const navigate = useNavigate();
  const { orders, loading, error } = useOrders();

  const handleLogout = () => {
    // Here you would typically clear any authentication tokens
    navigate('/');
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    // Main dashboard container
    <div id="mainDiv">
        {/* Logo container */}
        <img src={logo} alt="Mighty Lube Logo" className="logo" />

      <div className="dashboard">
        {/* Div for the table */}
        <div className="dashboard-content">

          <header className="dashboard-header">
            <h1>Dashboard</h1>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </header>

          <main id="tblDashboard">
            <OrderTable orders={cart} />
          </main>

        </div>

      </div>
    </div>

  );
}

export default Dashboard;