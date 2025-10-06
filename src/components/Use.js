import React, { useState, useEffect, useRef } from 'react';
import OrderDetailsPopup from './OrderDetailsPopup';

function Order({ order, onStatusChange }) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(order.orderStatus?.status || 'Requested');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
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
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const handleStatusClick = () => {
    if (!isDropdownOpen && statusButtonRef.current) {
      const rect = statusButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    setIsDropdownOpen(false);
    if (onStatusChange) {
      onStatusChange(order.orderID, newStatus);
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
              <div style={{
                position: 'fixed',
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                zIndex: 9999,
                minWidth: '130px',
                overflow: 'hidden'
              }}>
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
      <OrderDetailsPopup 
        isOpen={popupOpen} 
        onClose={closePopup} 
        order={order}
        userID="8d6cf435-e789-42a3-8ac6-82cf9b06dcc0"
      />
    </>
  );
}

export default Order;
