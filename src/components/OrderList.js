/*
This file is responsible for displaying the entire table of orders. It takes the individual rows created in Order.js and puts them together.
*/
import React from 'react';
import Order from './Order';

const getStatusColor = (status) => {
  switch (status) {
    case 'Processing':
      return '#ffd700';
    case 'Completed':
      return '#28a745';
    case 'Pending':
      return '#ff8c00';
    default:
      return 'black';
  }
};

function OrderList({ orders }) {
  // Function to calculate totals by status
  const getTotalsByStatus = () => {
    const counts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([status, count]) => `${status} (${count})`)
      .join(', ');
  };

/* Here the table begins generating the overall look. It creates the headers and fills in the body of the table using a reference to the Order.js file.
  The body of the table is filled dynamically using the map function to iterate through the orders array and create a new Order component for each order.
  The key prop is used to uniquely identify each order in the list.
  The HTML return from Order.js is used here to generate table rows for the table body.
*/

  return (
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

        <tbody> {orders.map((order) => (<Order key={order.id} order={order} />))} </tbody>
      
      </table>

    </div>
  );
}

export default OrderList;