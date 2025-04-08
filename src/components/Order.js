/*
This file takes in a list of order information and displays the information in a row table format. Individual rows are created here.
*/

import React from 'react';

// This function takes in order information and displays a table
function Order({ order }) {
  // Function to determine the color based on order status
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

  return (
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
  );
}

export default Order;