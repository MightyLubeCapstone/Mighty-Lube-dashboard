import React from "react";
import { useNavigate } from "react-router-dom";
import "../Assets/styles/login.css";
import { parseCartFromUserData } from "../hooks/useUsers";
import OrderTable from "../components/UseList";
import { useState, useEffect } from "react";
import logo from "../Assets/Images/ML_Logo-w-tag-vector.svg";

// Status color function - duplicated from OrderList for consistency
const getStatusColor = (status) => {
  switch (status) {
    case "Processing":
      return "#ffd700"; // Yellow for Processing
    case "Completed":
      return "#28a745"; // Green for Completed
    case "Pending":
      return "#ff8c00"; // Orange for Pending
    default:
      return "black";
  }
};

function Dashboard() {
  const [cart, setCart] = useState([]);

  // Sort cart based on sortBy state
  const [sortBy, setSortBy] = useState("orderID");

  
  const sortedCart = [...cart].sort((a, b) => {

    // Handle date sorting
    if (sortBy === "createdDate" || sortBy === "orderCreated") {
      const dateA = a.orderCreated?.$date?.$numberInt || a.quantity || 0;
      const dateB = b.orderCreated?.$date?.$numberInt || b.quantity || 0;
      return dateB - dateA;
    }

    // Handle quantity sorting
    if (sortBy === "quantity" || sortBy === "numRequested") {
      const qtyA = a.numRequested?.$numberInt || a.quantity || 0;
      const qtyB = b.numRequested?.$numberInt || b.quantity || 0;
      return qtyB - qtyA;
    }

    // String Sorting (orderID, productType, conveyorName, status)
    const valA = (a[sortBy] || a.productConfigurationInfo?.[sortBy] || "").toString().toLowerCase();
    const valB = (b[sortBy] || b.productConfigurationInfo?.[sortBy] || "").toString().toLowerCase();
    if (valA < valB) return -1;
    if (valA > valB) return 1;
    return 0;
  });

  useEffect(() => {
    // Fetch from users.json for cart data
    fetch("/users.json")
      .then((res) => res.json())
      .then((json) => {
        const parsed = parseCartFromUserData(json);
        setCart(parsed);
      })
      .catch((error) => {
        console.error("Error loading users:", error);
      });
  }, []);

  const navigate = useNavigate();
  const [adminPopupOpen, setAdminPopupOpen] = useState(false);
  const [settingsPopupOpen, setSettingsPopupOpen] = useState(false);

  const handleLogout = () => {
    // Here you would typically clear any authentication tokens
    navigate("/");
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

  // Create formatted status counts with appropriate colors from cart data
  const getColoredStatusCounts = () => {
    // If all cart items are treated as Pending
    const counts = { Pending: cart.length };

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
              <OrderTable orders={sortedCart} sortBy={sortBy} setSortBy={setSortBy} />
          </main>

          {/* Admin Popup */}
          {/* NavbarPopup
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
          </NavbarPopup> */}

          {/* Settings Popup */}
          {/* NavbarPopup
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
          </NavbarPopup> */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
