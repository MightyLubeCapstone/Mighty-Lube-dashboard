import React from 'react';
import Swal from 'sweetalert2';
import { getMappingKeysForProductType, getPreferencesForProduct } from '../utils/mappingRegistry';

function Order({ order }) {
  const getStatus = (quantity) => 'Pending';

  const handleDetailsClick = async () => {
    const result = await getMappingKeysForProductType(order.productType);
    const keys = (result && Array.isArray(result.keys)) ? result.keys : [];
    const displayPath = (result && result.successPath) || (result && Array.isArray(result.candidates) && result.candidates[0]) || '';

    const prefs = await getPreferencesForProduct(order.productType, order.productConfigurationInfo || {});
    const items = (prefs && Array.isArray(prefs.items)) ? prefs.items : [];
    const byName = {};
    for (let i = 0; i < items.length; i++) { byName[items[i].name] = items[i]; }

    const keysHtml = keys.length === 0
      ? `<em>No mapping keys found for ${order.productType}${displayPath ? ' at ' + displayPath : ''}.</em>`
      : '<ul style="margin: 0; padding-left: 18px;">' + keys.map(k => {
          const it = byName[k];
          const label = it && typeof it.label !== 'undefined' ? it.label : 'Undefined';
          const idx = it && typeof it.index !== 'undefined' ? it.index : '';
          const right = idx !== '' ? ` — ${label}` : ` — ${label}`;
          return `<li>${k}${right}</li>`;
        }).join('') + '</ul>';

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
          <div style="margin-bottom: 15px;">
            <strong>Mapping Variables:</strong>
            <div style="max-height: 240px; overflow:auto; border: 1px solid #eee; padding: 8px; border-radius: 4px;">
              ${keysHtml}
            </div>
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
