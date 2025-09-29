import React, { useState } from 'react';
import OrderDetailsPopup from './OrderDetailsPopup';

function Order({ order }) {
  const [popupOpen, setPopupOpen] = useState(false);

  const getStatus = (quantity) => 'Pending';

  const handleDetailsClick = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
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
      <OrderDetailsPopup 
        isOpen={popupOpen} 
        onClose={closePopup} 
        order={order} 
      />
    </>
  );
}

export default Order;
