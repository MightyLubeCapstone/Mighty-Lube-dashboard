/*
This file takes in a list of order information and displays the information in a row table format. Individual rows are created here.
*/

import React, { useState } from 'react';
import Popup from './Popup';

// This function takes in order information and displays a table
function Order({ order }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // Function to determine the color based on order status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return '#ffd700'; // Yellow for Processing
      case 'Completed':
        return '#28a745'; // Green for Completed
      case 'Pending':
        return '#ff8c00'; // Orange for Pending
      default:
        return 'black';
    }
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <tr key={order.id}>
        <td>#{order.id}</td>
        <td>{order.user}</td>
        <td>{order.part}</td>
        <td>
          <span className="status-label" style={{ color: getStatusColor(order.status) }}>{order.status}</span>
        </td>
        <td>{order.quantity}</td>
        <td>
          <button className="details-button">Details</button>
        </td>
      </tr>

      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        <h2>Order Details</h2>
        <p>Here you can add detailed information about order #{order.id}</p>
      </Popup>
    </>
  );
}

export default Order;