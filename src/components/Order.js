import React, { useState } from 'react';
import Popup from './Popup';

function Order({ order }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
          <span
            className="status-label"
            style={{ color: getStatusColor(order.status) }}
          >
            {order.status}
          </span>
        </td>
        <td>{order.quantity}</td>
        <td>
          <button className="details-button" onClick={openPopup}>Details</button>
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