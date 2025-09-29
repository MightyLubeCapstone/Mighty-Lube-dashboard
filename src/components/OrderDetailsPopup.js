import React, { useState, useEffect } from 'react';
import { getMappingKeysForProductType, getPreferencesForProduct, getMappingForProductType } from '../mappingRegistry';
import Popup from './Popup';
import '../Assets/styles/Popup.css';

function OrderDetailsPopup({ isOpen, onClose, order }) {
  const [mappingData, setMappingData] = useState({ keys: [], items: [], mapping: null });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen && order) {
      loadMappingData();
    }
  }, [isOpen, order]);

  const loadMappingData = async () => {
    setLoading(true);
    try {
      const result = await getMappingKeysForProductType(order.productType);
      const keys = (result && Array.isArray(result.keys)) ? result.keys : [];
      
      const productConfig = (order && order.productConfigurationInfo && typeof order.productConfigurationInfo === 'object')
        ? order.productConfigurationInfo
        : {};

      const prefs = await getPreferencesForProduct(order.productType, productConfig);
      const items = (prefs && Array.isArray(prefs.items)) ? prefs.items : [];

      const mappingResult = await getMappingForProductType(order.productType);
      const mapping = mappingResult.mapping;

      setMappingData({ keys, items, mapping });
    } catch (error) {
      console.error('Failed to load mapping data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getMappingOptions = (mappingKey) => {
    if (!mappingData.mapping) return {};
    
    const keyParts = mappingKey.split('.');
    let current = mappingData.mapping;
    
    for (const part of keyParts) {
      if (current && typeof current === 'object' && current[part]) {
        current = current[part];
      } else {
        return {};
      }
    }
    
    return current;
  };

  const getCurrentValue = (mappingKey) => {
    const item = mappingData.items.find(item => item.name === mappingKey);
    return item ? item.label : 'Undefined';
  };

  const getCurrentIndex = (mappingKey) => {
    const item = mappingData.items.find(item => item.name === mappingKey);
    return item ? item.index : null;
  };

  const handleDropdownChange = (mappingKey, newIndex) => {
    // This would typically update the order data
    // For now, we'll just log the change
    console.log(`Changed ${mappingKey} to index ${newIndex}`);
    
    // Update the local state to reflect the change
    setMappingData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.name === mappingKey 
          ? { ...item, index: newIndex, label: getMappingOptions(mappingKey)[newIndex] || 'Undefined' }
          : item
      )
    }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  if (!isOpen || !order) return null;

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className="order-details-content">
        <h2>Order #{order.orderID} Details</h2>
        
        <div className="order-info">
          <div className="info-row">
            <strong>Order ID:</strong> #{order.orderID}
          </div>
          <div className="info-row">
            <strong>Product Type:</strong> {order.productType}
          </div>
          <div className="info-row">
            <strong>Conveyor:</strong> {order.conveyorName}
          </div>
          <div className="info-row">
            <strong>Status:</strong> <span style={{ color: '#ffa500' }}>Pending</span>
          </div>
          <div className="info-row">
            <strong>Quantity:</strong> {order.quantity}
          </div>
          <div className="info-row">
            <strong>Created Date:</strong> {order.createdDate}
          </div>
        </div>

        <div className="mapping-variables-section">
          <div className="mapping-header-section">
            <h3>Mapping Variables</h3>
            <button 
              className={`edit-button ${isEditing ? 'editing' : ''}`}
              onClick={toggleEdit}
            >
              {isEditing ? 'Done' : 'Edit'}
            </button>
          </div>
          {loading ? (
            <div className="loading">Loading mapping data...</div>
          ) : mappingData.keys.length === 0 ? (
            <div className="no-mappings">
              <em>No mapping keys found for {order.productType}.</em>
            </div>
          ) : (
            <div className="mapping-grid">
              {mappingData.keys.map((key) => {
                const options = getMappingOptions(key);
                const currentValue = getCurrentValue(key);
                const currentIndex = getCurrentIndex(key);
                
                return (
                  <div key={key} className="mapping-item">
                    <div className="mapping-header">
                      <span className="mapping-label">{toTitleFromCamelOrSnake(key)}</span>
                      {currentIndex !== null && (
                        <span className="mapping-index">Index: {currentIndex}</span>
                      )}
                    </div>
                    {isEditing && (
                      <div className="mapping-control">
                        <select
                          value={currentIndex || ''}
                          onChange={(e) => handleDropdownChange(key, e.target.value)}
                          className="mapping-dropdown"
                        >
                          <option value="">Select an option</option>
                          {Object.entries(options).map(([index, label]) => (
                            <option key={index} value={index}>
                              {index}: {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="mapping-current-value">
                      Current: {currentValue}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Popup>
  );
}

export default OrderDetailsPopup;
