import React from 'react';
import '../Assets/styles/Popup.css';

function NavbarPopup({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    // Only close if the click was directly on the overlay, not on its children
    if (e.target.className === 'popup-overlay') {
      onClose();
    }
  };

  return (
    <div className="popup-overlay" onClick={handleOverlayClick}>
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>×</button>
        <div className="popup-body">
          <h2>{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}

export default NavbarPopup; 