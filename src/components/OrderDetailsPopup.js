import React, { useState, useEffect } from 'react';
import { getMappingKeysForProductType, getPreferencesForProduct, getMappingForProductType, getEnhancedOrderDetails, productTypeToImported } from '../mappingRegistry';
import { useNavigate } from 'react-router-dom';
import Popup from './Popup';
import '../Assets/styles/Popup.css';
import Swal from "sweetalert2";
import { parseCartFromUserData } from '../hooks/useUsers';


function OrderDetailsPopup({ isOpen, onClose, order, userID, onOrderUpdate }) {
  const [mappingData, setMappingData] = useState({ keys: [], items: [], mapping: null });
  const [enhancedDetails, setEnhancedDetails] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [freshOrder, setFreshOrder] = useState(null);

  // Fetch fresh order data from the database when popup opens
  const fetchFreshOrder = async (orderID) => {
    try {
      console.log('Fetching fresh order data for orderID:', orderID);
      const token = localStorage.getItem("sessionID");
      if (!token) {
        console.error('No session token found');
        return null;
      }

      const response = await fetch('https://mighty-lube.com/api/user_orders/allCarts', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const parsed = parseCartFromUserData(data);
        // Find the specific order by orderID
        const foundOrder = parsed.find(o => o.orderID === orderID);
        if (foundOrder) {
          console.log('Found fresh order data:', foundOrder);
          return foundOrder;
        } else {
          console.warn('Order not found in fresh data, using cached order');
          return null;
        }
      } else {
        console.error('Failed to fetch fresh order data:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching fresh order data:', error);
      return null;
    }
  };

  const loadMappingData = async (orderToUse) => {
    if (!orderToUse) return;
    
    setLoading(true);
    try {
      // Load enhanced details with schema-based enum resolution
      const enhancedResult = await getEnhancedOrderDetails(orderToUse.productType, orderToUse.productConfigurationInfo || {});
      setEnhancedDetails(enhancedResult);
      
      // Use enhanced details for the mapping variables display
      const keys = enhancedResult.items.map(item => item.name);
      const items = enhancedResult.items;
      
      // Get mapping from the productTypeToImported
      const imported = productTypeToImported[orderToUse.productType];
      const mapping = imported ? imported.mapping : null;

      console.log('Mapping data:', { keys, items, mapping });
      setMappingData({ keys, items, mapping });
    } catch (error) {
      console.error('Failed to load mapping data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && order) {
      // Fetch fresh order data when popup opens
      const loadFreshData = async () => {
        setLoading(true);
        const fresh = await fetchFreshOrder(order.orderID);
        if (fresh) {
          setFreshOrder(fresh);
          // Load mapping data with fresh order
          await loadMappingData(fresh);
        } else {
          // Fallback to cached order if fresh fetch fails
          setFreshOrder(order);
          await loadMappingData(order);
        }
        setLoading(false);
      };
      loadFreshData();
    } else if (!isOpen) {
      // Reset state when popup closes
      setFreshOrder(null);
    }
  }, [isOpen, order?.orderID]);

  // Use freshOrder if available, otherwise fallback to order prop
  const currentOrder = freshOrder || order;

  const navigate = useNavigate();


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
    if (!mappingData.mapping) {
      console.log('No mapping data available');
      return {};
    }
    
    // Direct access to mapping by field name
    const mapping = mappingData.mapping[mappingKey];
    //console.log(`Getting mapping options for ${mappingKey}:`, mapping);
    
    if (mapping && typeof mapping === 'object') {
      return mapping;
    }
    
    return {};
  };

  const getCurrentValue = (mappingKey) => {
    const item = mappingData.items.find(item => item.name === mappingKey);
    if (!item) return 'Undefined';
    
    const value = item.value;
    if (value === 'undefined') return 'undefined';
    if (value === null || value === undefined) return 'Not set';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const getCurrentIndex = (mappingKey) => {
    const item = mappingData.items.find(item => item.name === mappingKey);
    if (!item) return null;
    
    // Get the original user value (before enum resolution)
    const originalValue = item.originalValue;
    if (originalValue === 'undefined' || originalValue === null || originalValue === undefined) return null;
    if (typeof originalValue === 'object') return null; // Don't show index for objects
    if (typeof originalValue === 'string') return null; // Don't show index for strings
    return String(originalValue);
  };

  const getFieldType = (mappingKey) => {
    const item = mappingData.items.find(item => item.name === mappingKey);
    if (!item) return 'Unknown';
    
    if (item.isEnum) return 'Enum';
    if (item.type === String) return 'String';
    if (item.type === Number) return 'Number';
    if (item.type === Boolean) return 'Boolean';
    return 'Unknown';
  };

  const handleDropdownChange = (mappingKey, newIndex) => {
    // This would typically update the order data
    // For now, we'll just log the change
    console.log(`Changed ${mappingKey} to index ${newIndex}`);
    
    // Get the new display value from the mapping
    const options = getMappingOptions(mappingKey);
    const newDisplayValue = options[newIndex] || 'Undefined';
    
    // Convert string index back to number for originalValue
    const numericIndex = parseInt(newIndex, 10);
    
    // Update the local state to reflect the change
    setMappingData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.name === mappingKey 
          ? { 
              ...item, 
              value: newDisplayValue,           // Display value (e.g., "Frost")
              originalValue: numericIndex,      // Original numeric value (e.g., 2)
              index: numericIndex               // For compatibility
              // Note: label should NOT change - it should stay as the field name
            }
          : item
      )
    }));
  };

  const handleInputChange = (mappingKey, newValue) => {
    console.log(`Changed ${mappingKey} to value ${newValue}`);
    
    // Update the local state to reflect the change
    setMappingData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.name === mappingKey 
          ? { ...item, value: newValue, originalValue: newValue }
          : item
      )
    }));
  };

  const updateUserPreferences = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("sessionID");
      if (!token) {
        console.error('No session token found');
        return;
      }

      if (!userID) {
        console.error('No userID provided');
        alert('User ID not available. Please refresh and try again.');
        return;
      }

      if (!currentOrder) {
        console.error('No order data available');
        alert('Order data not available. Please try again.');
        return;
      }

      // Build the updated product configuration info from the current mapping data
      const updatedConfig = { ...currentOrder.productConfigurationInfo };
      
      // Update the configuration with the new mapping values
      mappingData.items.forEach(item => {
      const value = item.index ?? item.value; // use index for enums, value for strings
      if (value !== undefined && value !== null) {
        const keyParts = item.name.split('.');
        let current = updatedConfig;

        for (let i = 0; i < keyParts.length - 1; i++) {
          if (!current[keyParts[i]]) current[keyParts[i]] = {};
          current = current[keyParts[i]];
        }

        current[keyParts[keyParts.length - 1]] = value;
      }
      });

      // Debug: Log the order and orderID
      console.log('Order object:', currentOrder);
      console.log('Order ID:', currentOrder?.orderID);
      console.log('Updated config:', updatedConfig);

      // Create the complete order object with updated configuration
      const updatedOrder = {
        ...currentOrder,
        productConfigurationInfo: updatedConfig
      };

      // Optimistic update - update parent component immediately
      if (onOrderUpdate) {
        onOrderUpdate(currentOrder.orderID, updatedOrder);
      }

      const requestBody = {
        userID: userID,
        order: {
          orderID: currentOrder.orderID,
          numRequested: currentOrder.numRequested || currentOrder.quantity,
          orderStatus: currentOrder.orderStatus || { status: "Requested" },
          productConfigurationInfo: updatedConfig
        }
      };
      console.log('Request body for update:', requestBody);

      const response = await fetch('https://mighty-lube.com/api/orders/editing', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Preferences updated successfully:', result);
        
        // Fetch fresh order data after successful update
        const fresh = await fetchFreshOrder(currentOrder.orderID);
        if (fresh) {
          setFreshOrder(fresh);
          await loadMappingData(fresh);
        }
        
        // Optionally show a success message to the user
          Swal.fire({
            icon: "success",
            title: "Preferences Updated",
            text: "Your preferences have been updated successfully.",
          });
      } else {
        const errorData = await response.json();
        
        // Revert the optimistic update if backend update failed
        if (onOrderUpdate) {
          onOrderUpdate(currentOrder.orderID, currentOrder); // Revert to original order
        }
        
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: `Failed to update preferences: ${errorData.message || 'Unknown error'}`,
          });
      }
    } catch (error) {
      // Revert the optimistic update if there was an error
      if (onOrderUpdate && currentOrder) {
        onOrderUpdate(currentOrder.orderID, currentOrder); // Revert to original order
      }
      
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: "Could not connect to the server. Please try again later.",
          });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEdit = async () => {
    if (isEditing) {
      // User is pressing "Done" - save the changes
      await updateUserPreferences();
    }
    setIsEditing(!isEditing);
  };

  if (!isOpen || !currentOrder) return null;

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className="order-details-content">
        <h2>Order #{currentOrder.orderID} Details</h2>
        
        <div className="order-info">
          <div className="info-row">
            <strong>Order ID:</strong> #{currentOrder.orderID}
          </div>
          <div className="info-row">
            <strong>Product Type:</strong> {currentOrder.productType}
          </div>
          <div className="info-row">
            <strong>Conveyor:</strong> {currentOrder.conveyorName}
          </div>
          <div className="info-row">
            <strong>Status:</strong> <span style={{ color: '#ffa500' }}>Pending</span>
          </div>
          <div className="info-row">
            <strong>Quantity:</strong> {currentOrder.quantity}
          </div>
          <div className="info-row">
            <strong>Created Date:</strong> {currentOrder.createdDate}
          </div>
        </div>

        <div className="mapping-variables-section">
          <div className="mapping-header-section">
            <h3>Mapping Variables</h3>
            <button 
              className={`edit-button ${isEditing ? 'editing' : ''}`}
              onClick={toggleEdit}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : (isEditing ? 'Done' : 'Edit')}
            </button>
          </div>
          {loading ? (
            <div className="loading">Loading mapping data...</div>
          ) : mappingData.keys.length === 0 ? (
            <div className="no-mappings">
              <em>No mapping keys found for {currentOrder.productType}.</em>
            </div>
          ) : (
            <div className="mapping-grid">
              {mappingData.items.map((item) => {
                const options = getMappingOptions(item.name);
                const currentValue = getCurrentValue(item.name);
                const currentIndex = getCurrentIndex(item.name);
                const fieldType = getFieldType(item.name);
                
                return (
                  <div key={item.name} className="mapping-item">
                    <div className="mapping-header">
                      <span className="mapping-label">{item.label}</span>
                      <div className="mapping-meta">
                        {currentIndex !== null && (
                          <span className="mapping-index">Index: {currentIndex}</span>
                        )}
                        <span className={`mapping-type ${fieldType.toLowerCase()}-type`}>{fieldType}</span>
                      </div>
                    </div>
                    {isEditing && (
                      <div className="mapping-control">
                        {item.isEnum ? (
                          <select
                            value={String(currentIndex || '')}
                            onChange={(e) => handleDropdownChange(item.name, e.target.value)}
                            className="mapping-dropdown"
                          >
                            <option value="">Select an option</option>
                            {Object.entries(options).map(([index, label]) => (
                              <option key={index} value={index}>
                                {index}: {label}
                              </option>
                            ))}
                          </select>
                        ) : fieldType === 'String' ? (
                          <input
                            type="text"
                            value={currentValue === 'undefined' ? '' : currentValue}
                            onChange={(e) => handleInputChange(item.name, e.target.value)}
                            className="mapping-input string-input"
                            placeholder="Enter text..."
                          />
                        ) : fieldType === 'Number' ? (
                          <input
                            type="number"
                            value={currentValue === 'undefined' ? '' : currentValue}
                            onChange={(e) => handleInputChange(item.name, e.target.value)}
                            className="mapping-input number-input"
                            placeholder="Enter number..."
                          />
                        ) : null}
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
