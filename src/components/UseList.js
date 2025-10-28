import React, { useState } from 'react';
import Order from './Use';
import OrderDetailsPopup from './OrderDetailsPopup';

function OrderTable({ orders, onStatusChange, onRefreshOrders }) {
  const [sortConfig, setSortConfig] = useState({ key: 'orderID', direction: 'asc' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  // Sorting function
  const sortedOrders = [...orders].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (!a[key]) return 1;
    if (!b[key]) return -1;

    let comparison = 0;

    if (key === 'quantity') {
      comparison = a[key] - b[key]; // numeric sort
    } else if (key === 'createdDate') {
      comparison = new Date(a[key]) - new Date(b[key]); // date sort
    } else {
      comparison = String(a[key]).localeCompare(String(b[key])); // string sort
    }

    return direction === 'asc' ? comparison : -comparison;
  });

  // Click handler for headers
  const handleHeaderClick = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        // Same key -> reverse direction
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        // New key -> ascending by default
        return { key, direction: 'asc' };
      }
    });
  };

  // Optional: display arrow in header
  const getHeaderArrow = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  const handleDetailsClick = (order) => {
    console.log('Order passed to details:', order);
    console.log('Order ID in details:', order?.orderID);
    setSelectedOrder(order);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="order-list-card">
      <h2>Order List</h2>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleHeaderClick('orderID')}>Order ID{getHeaderArrow('orderID')}</th>
            <th onClick={() => handleHeaderClick('username')}>User{getHeaderArrow('username')}</th>
            <th onClick={() => handleHeaderClick('productType')}>Type{getHeaderArrow('productType')}</th>
            <th onClick={() => handleHeaderClick('conveyorName')}>Conveyor{getHeaderArrow('conveyorName')}</th>
            <th onClick={() => handleHeaderClick('status')}>Status{getHeaderArrow('status')}</th>
            <th onClick={() => handleHeaderClick('quantity')}>Quantity{getHeaderArrow('quantity')}</th>
            <th onClick={() => handleHeaderClick('createdDate')}>Created{getHeaderArrow('createdDate')}</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order, idx) => (
            <Order 
              key={`${order.orderID}-${idx}`} 
              order={order} 
              onStatusChange={onStatusChange}
              onDetailsClick={handleDetailsClick}
              userID={order.userID}
              onRefreshOrders={onRefreshOrders}
            />
          ))}
        </tbody>
      </table>
      
      {/* Popup rendered outside table structure */}
      <OrderDetailsPopup 
        isOpen={popupOpen} 
        onClose={closePopup} 
        order={selectedOrder}
        userID={selectedOrder?.userID}
      />
    </div>
  );
}

export default OrderTable;
