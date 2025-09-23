import React from 'react';
import Swal from 'sweetalert2';
import { getMappingKeysForProductType, getPreferencesForProduct } from '../mappingRegistry';

function Order({ order }) {
  const getStatus = (quantity) => 'Pending';

  const toTitleFromCamelOrSnake = (input) => {
    if (!input || typeof input !== 'string') return '';
    const parts = input.split('.');
    const humanized = parts.map((part) => {
      const spaced = part
        .replace(/[_-]+/g, ' ')
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/\s+/g, ' ')
        .trim();
      return spaced
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    });
    return humanized.join(' | ');
  };

  const handleDetailsClick = async () => {
    try {
      const result = await getMappingKeysForProductType(order.productType);

      console.log("OIRGINNN");
      console.log(order);

      const keys = (result && Array.isArray(result.keys)) ? result.keys : [];
      const displayPath = (result && result.successPath) || (result && Array.isArray(result.candidates) && result.candidates[0]) || '';

      const productConfig = (order && order.productConfigurationInfo && typeof order.productConfigurationInfo === 'object')
        ? order.productConfigurationInfo
        : {};
      
      console.log(order);
      // console.log(order.cart.productConfigurationInfo)
      console.log('productConfigurationInfo:', JSON.stringify(productConfig, null, 2));

      const productConfigs = order.cart
      console.log(productConfigs);

      const prefs = await getPreferencesForProduct(order.productType, productConfig);
      const items = (prefs && Array.isArray(prefs.items)) ? prefs.items : [];
      const byName = {};
      for (let i = 0; i < items.length; i++) { byName[items[i].name] = items[i]; }

      const keysHtml = keys.length === 0
        ? `<em>No mapping keys found for ${order.productType}${displayPath ? ' at ' + displayPath : ''}.</em>`
        : (
          '<div style="display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px;">'
          + keys.map(k => {
              const it = byName[k];
              const label = it && typeof it.label !== 'undefined' ? it.label : 'Undefined';
              const idx = it && typeof it.index !== 'undefined' ? it.index : '';
              return `
                <div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:10px;">
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
                    <span style="font-weight:600; color:#111827;">${toTitleFromCamelOrSnake(k)}</span>
                    ${idx !== '' ? `<span style="color:#6b7280; font-size:12px;">Index: ${idx}</span>` : ''}
                  </div>
                  <div style="color:#374151; font-size:13px;">${label}</div>
                </div>
              `;
            }).join('')
          + '</div>'
        );

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
            <div style="margin-bottom: 0;">
              <strong style="display:inline-block; margin-bottom: 8px;">Mapping Variables:</strong>
              <div style="max-height: 31.5vh; overflow:auto; border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px; background:#ffffff;">${keysHtml}</div>
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
        width: '90%',
        height: '100vh',
        customClass: {
          popup: 'swal2-fullscreen-popup'
        }
      });
    } catch (error) {
      console.error('Failed to load order details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Unable to load details',
        text: 'There was a problem fetching mapping keys or preferences.'
      });
    }
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
