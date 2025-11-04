import React, { useState, useEffect, useRef } from 'react';
import { updateOrderStatus } from '../utils/orderUpdates';

function Order({ order, onStatusChange, onDetailsClick, userID }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(order.orderStatus?.status || 'Requested');
  const dropdownRef = useRef(null);
  const statusButtonRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getStatus = (quantity) => currentStatus;

  const handleDetailsClick = () => {
    if (onDetailsClick) {
      onDetailsClick(order);
    }
  };

  const handleStatusClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleStatusChange = async (newStatus) => {
    setCurrentStatus(newStatus);
    setIsDropdownOpen(false);
    
    // Call the API to update the status
    if (userID) {
      console.log('Calling updateOrderStatus...');
      const success = await updateOrderStatus(order.orderID, newStatus, userID, order);
      console.log('updateOrderStatus returned:', success);
      
      if (success === true) {
        console.log('Status updated successfully in backend');
        // Only update local state if backend update was successful
        if (onStatusChange) {
          onStatusChange(order.orderID, newStatus);
        }
      } else {
        console.error('Failed to update status in backend - success was:', success);
        // Revert the local status change if backend update failed
        setCurrentStatus(order.orderStatus?.status || 'Requested');
        alert('Failed to update order status. Please try again.');
      }
    } else {
      console.warn('No userID available for status update');
      // Revert the local status change if no userID
      setCurrentStatus(order.orderStatus?.status || 'Requested');
      alert('User ID not available. Please refresh and try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Requested':
        return '#ffa500';
      case 'Complete':
        return '#28a745';
      case 'Pending':
        return '#ff6b35';
      default:
        return 'black';
    }
  };

  const status = getStatus(order.quantity);

  return (
    <>
    {console.log('Rendering Order component for orderID:', order)}
      <tr key={order.orderID}>
        <td>{order.configurationName}</td>
        <td>#{order.orderID}</td>
        <td>{order.username}</td>
        <td>{order.productType}</td>
        <td>{order.conveyorName}</td>
        <td>
          <div ref={dropdownRef} style={{ position: 'relative', display: 'block', width: '100%' }}>
            <span 
              ref={statusButtonRef}
              style={{ 
                color: getStatusColor(status), 
                cursor: 'pointer',
                padding: '4px 4px 4px 0px',
                border: '1px solid transparent',
                borderRadius: '4px',
                display: 'block',
                width: '100%',
                textAlign: 'left',
                boxSizing: 'border-box'
              }}
              onClick={handleStatusClick}
            >
              {status}
            </span>
            {isDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',        
                      left: 0,          
                      marginTop: '4px',   
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      zIndex: 9999,
                      minWidth: '130px',
                      overflow: 'hidden'
                    }}
                  >
                {['Requested', 'Pending', 'Complete'].map((statusOption) => (
                  <div
                    key={statusOption}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      color: getStatusColor(statusOption),
                      backgroundColor: statusOption === currentStatus ? '#f8f9fa' : 'white',
                      fontSize: '15px',
                      fontWeight: statusOption === currentStatus ? '500' : '400',
                      transition: 'all 0.15s ease',
                      borderBottom: statusOption !== 'Complete' ? '1px solid #f1f3f4' : 'none'
                    }}
                    onClick={() => handleStatusChange(statusOption)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = statusOption === currentStatus ? '#f8f9fa' : 'white'}
                  >
                    {statusOption}
                  </div>
                ))}
              </div>
            )}
          </div>
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
