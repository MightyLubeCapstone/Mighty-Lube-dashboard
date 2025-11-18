import React, { useState, useEffect, useRef } from 'react';
import { updateOrderStatus } from '../utils/orderUpdates';
import OrderTimer from './OrderTimer';

function Order({ order, onStatusChange, onDetailsClick, onDelete, userID, onRefreshOrders }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(order.orderStatus?.status || 'Requested');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const statusButtonRef = useRef(null);
  const actionMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setIsActionMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update currentStatus when order prop changes (after refresh)
  useEffect(() => {
    // console.log('Order prop changed, current status is now:', order.orderStatus?.status || 'Requested');
  }, [order.orderStatus?.status]);

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
    // Show updating state
    setIsDropdownOpen(false);
    setIsUpdating(true);
    
    try {
      // Call the API to update the status first
      if (userID) {
        // console.log('Calling updateOrderStatus...');
        const success = await updateOrderStatus(order.orderID, newStatus, userID, order);
        // console.log('updateOrderStatus returned:', success);
        
        if (success !== true) {
          console.error('Failed to update status in backend - success was:', success);
          alert('Failed to update order status. Please try again.');
        } else {
          // If backend update was successful, refresh the orders list to get fresh data
          // console.log('Status updated successfully, refreshing ALL orders from backend...');
          if (onRefreshOrders) {
            await onRefreshOrders(); // Wait for refresh to complete
          }
        }
      } else {
        console.warn('No userID available for status update');
        alert('User ID not available. Please refresh and try again.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    setIsActionMenuOpen(false);
    if (onDelete) {
      onDelete(order);
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
                cursor: isUpdating ? 'not-allowed' : 'pointer',
                padding: '4px 4px 4px 0px',
                border: '1px solid transparent',
                borderRadius: '4px',
                display: 'block',
                width: '100%',
                textAlign: 'left',
                boxSizing: 'border-box',
                opacity: isUpdating ? 0.7 : 1
              }}
              onClick={isUpdating ? undefined : handleStatusClick}
            >
              {isUpdating ? 'Updating...' : status}
            </span>
            {isDropdownOpen && !isUpdating && (
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
        <td><OrderTimer createdTime={order.createdDate} /></td>
        <td>
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '8px' }} ref={actionMenuRef}>
            <button className="details-button" onClick={handleDetailsClick}>Details</button>
            <button
              aria-label="More actions"
              onClick={() => setIsActionMenuOpen((v) => !v)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px 8px',
                lineHeight: 1,
              }}
              title="More actions"
            >
              ⋮
            </button>
            {isActionMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  zIndex: 10000,
                  minWidth: '150px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{ padding: '10px 12px', cursor: 'pointer', color: '#dc2626' }}
                  onClick={handleDelete}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  Delete order
                </div>
              </div>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}

export default Order;
