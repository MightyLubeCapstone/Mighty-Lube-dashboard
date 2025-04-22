import React from 'react';

function Order({ order }) {
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
        <span
          className="status-label"
          style={{ color: getStatusColor(order.status) }}
        >
          {order.status}
        </span>
      </td>
      <td>{order.quantity}</td>
      <td>
        <button className="details-button">Details</button>
      </td>
    </tr>
  );
}

export default Order; 