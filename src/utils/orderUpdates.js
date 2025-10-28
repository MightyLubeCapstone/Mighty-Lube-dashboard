// Utility functions for updating orders via API


export const updateOrderStatus = async (orderID, newStatus, userID, orderData) => {
  try {
    const token = localStorage.getItem("sessionID");
    if (!token) {
      console.error('No session token found');
      return false;
    }

    if (!userID) {
      console.error('No userID provided');
      alert('User ID not available. Please refresh and try again.');
      return false;
    }

    const requestBody = {
      userID: userID,
      configurationName: orderData?.configurationName || "test-tntech",
      orderStatus: newStatus
    };

    console.log('Status update request body:', requestBody);
    console.log('Full payload:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://mighty-lube.com/api/orders/status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Status updated successfully:', result);
      window.location.reload(); // Refresh the page to reflect changes
      return true;
    } else {
      const errorData = await response.json();
      console.error('Failed to update orderStatus - Status:', response.status);
      console.error('Error data:', errorData);
      alert(`Failed to update order status. Server returned: ${response.status} - ${errorData.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.error('Error updating orderStatus:', error);
    alert('Error updating orderStatus. Please check your connection and try again.');
    return false;
  }
};

export const updateOrderConfiguration = async (orderID, updatedConfig, userID, orderData) => {  
  try {
    const token = localStorage.getItem("sessionID");
    if (!token) {
      console.error('No session token found');
      return false;
    }

    if (!userID) {
      console.error('No userID provided');
      alert('User ID not available. Please refresh and try again.');
      return false;
    }

    // Create the payload in the EXACT order requested
    console.log('Creating payload with order: userID, orderStatus, order');
    
    // Ensure updatedConfig is not null/undefined
    const safeConfig = updatedConfig || {};
    
    // Extract orderStatus from updatedConfig and remove it from the config
    const { orderStatus, ...cleanConfig } = safeConfig;
    
    const requestBody = {
      userID: userID,
      order: {
        orderID: orderID,
        orderStatus: orderStatus?.status || orderData?.orderStatus?.status || "Requested",
        numRequested: orderData?.numRequested || orderData?.quantity,
        productConfigurationInfo: cleanConfig
      }
    };

    console.log('Configuration update request body:', requestBody);
    console.log('Full payload:', JSON.stringify(requestBody, null, 2));
    
    // Verify the configuration explicitly
    const configKeys = Object.keys(requestBody.order);
    console.log('VERIFICATION - Order should be: orderID, orderStatus, numRequested, productConfigurationInfo');
    console.log('VERIFICATION - Actual order is:', configKeys.join(', '));
    console.log('VERIFICATION - Is correct?', 
      configKeys[0] === 'orderID' && 
      configKeys[1] === 'orderStatus' && 
      configKeys[2] === 'numRequested' && 
      configKeys[3] === 'productConfigurationInfo'
    );

    const response = await fetch('https://mighty-lube.com/api/orders/editing', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (response.ok) {
      const result = await response.json();
      console.log('Configuration updated successfully:', result);
      return true;
    } else {
      const errorData = await response.json();
      console.error('Failed to update configuration - Status:', response.status);
      console.error('Error data:', errorData);
      alert(`Failed to update configuration. Server returned: ${response.status} - ${errorData.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.error('Error updating configuration:', error);
    alert('Error updating configuration. Please check your connection and try again.');
    return false;
  }
};
