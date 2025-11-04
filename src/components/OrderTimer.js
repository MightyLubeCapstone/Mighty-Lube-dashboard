import React, { useState, useEffect } from 'react';
 
const OrderTimer = ({ createdTime }) => {
  const [elapsedTime, setElapsedTime] = useState('');
 
  useEffect(() => {
    const calculateElapsedTime = () => {
      const now = new Date();
      const created = new Date(createdTime);
      const diffMs = now - created;
     
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
     
      if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
      } else {
        return `${seconds}s`;
      }
    };
 
    // Calculate initial elapsed time
    setElapsedTime(calculateElapsedTime());
 
    // Update every second
    const timer = setInterval(() => {
      setElapsedTime(calculateElapsedTime());
    }, 1000);
 
    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [createdTime]);
 
  return (
    <span style={{
      fontSize: '0.9em',
      color: '#000000ff',
      fontStyle: 'normal',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      fontWeight: 'normal',
      marginLeft: '8px'
    }}>
      {elapsedTime}
    </span>
  );
};
 
export default OrderTimer;  