import React from 'react';
import Swal from 'sweetalert2';

function Order({ order }) {
  const getStatus = (quantity) => 'Pending';

  const handleDetailsClick = () => {
    Swal.fire({
      title: `Order #${order.orderID} Details`,
      html: `
        <div style="text-align: left; padding: 20px;">
          <div style="margin-bottom: 15px;">
            <strong>Order ID:</strong> #${order.orderID}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Product Type:</strong> ${order.productType}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Conveyor:</strong> ${order.conveyorName}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Status:</strong> <span style="color: #ffa500;">${getStatus(order.quantity)}</span>
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Quantity:</strong> ${order.quantity}
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Created Date:</strong> ${order.createdDate}
          </div>
        </div>
      `,
      background: '#ffffff',
      showConfirmButton: true,
      confirmButtonText: 'Close',
      confirmButtonColor: '#007bff',
      showCloseButton: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
      width: '80%',
      height: '60vh',
      customClass: {
        popup: 'swal2-fullscreen-popup'
      }
    });
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
    <>
    <tr key={order.orderID}>
      <td>#{order.orderID}</td>
      <td>{order.productType}</td>
      <td>{order.conveyorName}</td>
      <td>
        <span style={{ color: getStatusColor(status) }}>{status}</span>
      </td>
      <td>{order.quantity}</td>
      <td>{order.createdDate}</td>
      <td>
        <button className="details-button" onClick={handleDetailsClick}>Details</button>
      </td>
    </tr>
    </>
  );
}

export default Order;
