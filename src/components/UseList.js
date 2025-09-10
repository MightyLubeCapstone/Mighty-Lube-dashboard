/*
This file is responsible for displaying the entire table of orders. It takes the individual rows created in Order.js and puts them together.
*/
import React from 'react';
import Order from './Use';

// function OrderTable({ orders, sortBy, setSortBy }) {

function OrderTable({ orders }) {
  return (
    <div className="dashboard-container">
 

      {/* Here the table begins generating the overall look. It creates the headers and fills in the body of the table using a reference to the Order.js file.
          The body of the table is filled dynamically using the map function to iterate through the orders array and create a new Order component for each order.
          The key prop is used to uniquely identify each order in the list.
          The HTML return from Order.js is used here to generate table rows for the table body.
      */}
      
    <div className="order-list-card">
      <h2>Order List</h2>

{/* This is a potential functionality for sorting the table:

        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1rem' 
          }}
        >
        <h2 style={{ margin: 0 }}>Order List</h2>
        <div>
          <label>
            Sort by:&nbsp;
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="orderID">Order ID</option>
              <option value="productType">Product Type</option>
              <option value="conveyorName">Conveyor Name</option>
              <option value="status">Status</option>
              <option value="quantity">Quantity</option>
              <option value="createdDate">Created Date</option>
              </select>
          </label>
          </div>
        </div>

*/}

        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Type</th>
              <th>Conveyor</th>
              <th>Status</th>
              <th>Quantity</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <Order key={`${order.orderID}-${idx}`} order={order} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderTable;