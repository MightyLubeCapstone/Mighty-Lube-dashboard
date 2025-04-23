import React from 'react';

function Order({ order }) {
  const getStatus = (quantity) => {
    if (quantity >= 2) return 'Processing';
    if (quantity === 1) return 'Pending';
    return 'Completed';
  };

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

  const status = getStatus(order.quantity);

  return (
    <tr>
      <td>#{order.orderID}</td>
      <td>{order.productType}</td>
      <td>{order.conveyorName}</td>
      <td>
        <span style={{ color: getStatusColor(status) }}>{status}</span>
      </td>
      <td>{order.quantity}</td>
      <td>{order.createdDate}</td>
      <td>
        <button className="details-button">Details</button>
      </td>
    </tr>
  );
}

export default Order;
