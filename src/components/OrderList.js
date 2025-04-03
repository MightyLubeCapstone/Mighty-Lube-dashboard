import React from 'react';
import Order from './Order';

function OrderList({ orders }) {
  const getTotalsByStatus = () => {
    const counts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(counts)
      .map(([status, count]) => `${status} (${count})`)
      .join(', ');
  };

  return (
    <div className="dashboard-container">
      <div className="summary-card">
        <h2>Summary</h2>
        <p>Total Orders: {orders.length}</p>
        <p>Total Parts Ordered: {orders.reduce((sum, order) => sum + order.quantity, 0)}</p>
        <p>Orders by Status: {getTotalsByStatus()}</p>
      </div>

      <div className="order-list-card">
        <h2>Order List</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Ordered Part</th>
              <th>Status</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <Order key={order.id} order={order} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderList; 