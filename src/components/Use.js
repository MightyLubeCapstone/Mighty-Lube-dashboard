import React from 'react';
import Popup from './Popup';
import { useState } from 'react';

function Order({ order }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const getStatus = (quantity) => {
    if (quantity >= 2) return 'Processing';
    if (quantity === 1) return 'Pending';
    return 'Completed';
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
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
