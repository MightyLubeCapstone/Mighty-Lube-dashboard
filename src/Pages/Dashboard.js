import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Assets/styles/login.css';
import { parseCartFromUserData } from '../hooks/useUsers';
import OrderTable from '../components/UseList';
import { useState, useEffect } from 'react';
import logo from '../Assets/Images/ML_Logo-w-tag-vector.svg';

// Status color function - duplicated from OrderList for consistency
const getStatusColor = (status) => {
  switch (status) {
    case "Requested":
      return "#ffa500"; // Orange for Requested
    case "Complete":
      return "#28a745"; // Green for Complete
    case "Pending":
      return "#ff6b35"; // More orange for Pending
    default:
      return "black";
  }
};

function Dashboard({ orders = [], getStatusColor: propGetStatusColor, getTotalsByStatus }) {
    const [cart, setCart] = useState([]);

    const handleStatusChange = (orderID, newStatus) => {
      setCart(prevCart => 
        prevCart.map(order => 
          order.orderID === orderID 
            ? { ...order, orderStatus: { ...order.orderStatus, status: newStatus } }
            : order
        )
      );
    };
    
    useEffect(() => {
   /*   // Fetch from users.json for cart data
      fetch('/users.json')
        .then(res => res.json())
        .then(json => {
          const parsed = parseCartFromUserData(json);
          setCart(parsed);
        })
        .catch(error => {
          console.error('Error loading users:', error);
        }); */
      // where we fetch the cart data from the API
          const fetchConfigurations = async () => {
      try {
        const token = localStorage.getItem("sessionID"); // like SharedPreferences in Flutter
        const response = await fetch('https://mighty-lube.com/api/configurations', {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const parsed = parseCartFromUserData(data.configurations); 
          setCart(parsed);
        } else if (response.status === 400) {
          setCart([]);
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error("Error fetching configurations:", error);
        setCart([]);
      }
    };

    fetchConfigurations();
    }, []);

  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [adminPopupOpen, setAdminPopupOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [settingsPopupOpen, setSettingsPopupOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [configurationsPopupOpen, setConfigurationsPopupOpen] = useState(false);
  
  // Removed the undefined useOrders() call

  const handleLogout = () => {
    // Here you would typically clear any authentication tokens
    navigate("/");
  };

  const openAdminPopup = (e) => {
    e.preventDefault();
    setAdminPopupOpen(true);
  };

  // eslint-disable-next-line no-unused-vars
  const closeAdminPopup = () => {
    setAdminPopupOpen(false);
  };

  const openSettingsPopup = (e) => {
    e.preventDefault();
    setSettingsPopupOpen(true);
  };

  // eslint-disable-next-line no-unused-vars
  const closeSettingsPopup = () => {
    setSettingsPopupOpen(false);
  };
  
  // eslint-disable-next-line no-unused-vars
  const openConfigurationsPopup = (e) => {
    e.preventDefault();
    setConfigurationsPopupOpen(true);
  };
  
  // eslint-disable-next-line no-unused-vars
  const closeConfigurationsPopup = () => {
    setConfigurationsPopupOpen(false);
  };

  // Create formatted status counts with appropriate colors from cart data
  const getColoredStatusCounts = () => {
    // Count actual statuses from cart data
    const counts = cart.reduce((acc, order) => {
      const status = order.orderStatus?.status || 'Requested';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([status, count], index) => (
      <span key={status}>
        <span style={{ color: getStatusColor(status) }}>
          {status} ({count})
        </span>
        {index < Object.entries(counts).length - 1 ? ", " : ""}
      </span>
    ));
  };

  return (
    // Main dashboard container
    <div id="mainDiv">
      <div className="dashboard">
        {/* Div for the table */}
        <div className="dashboard-content">
          <header className="dashboard-header">
            {/* Logo container */}
            <img src={logo} alt="Mighty Lube Logo" className="logo" />

            <h1>Dashboard</h1>

            <div
              style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
            >
              <nav className="nav-links">
                <a href="#admin" onClick={openAdminPopup}>
                  Admin
                </a>
                <a href="#settings" onClick={openSettingsPopup}>
                  Settings
                </a>
              </nav>

              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </header>

          {/* Summary card */}
          <div className="summary-card">
            <div style={{ margin: "0 20px" }}>
              <h2>Summary</h2>
              <p>Total Orders: {cart.length}</p>
              <p>
                Total Parts Ordered:{" "}
                {cart.reduce((sum, item) => sum + (item.quantity || 0), 0)}
              </p>
              <p>Orders by Status: {getColoredStatusCounts()}</p>
            </div>
          </div>

          <main id="tblDashboard">
{/* 
OrderTable here serves as a function call to the function defined in the UseList.js file under src\components\UseList.js.
The function is being passed the cart variable to be used as an argument in the OrderTable function, 
additional arguments will need to be defined by the user via UI Input if we choose to add a sort function.

The parameters for OrderTable are defined in the UseList.js file.

The return for the function is a table
*/}
              <OrderTable orders={cart} onStatusChange={handleStatusChange} />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
