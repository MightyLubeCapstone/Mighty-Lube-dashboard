/**
 * Parses the MongoDB-style Extended JSON format cart data
 * and returns a clean, flat array of cart items
 */
export function parseCartFromUserData(data) {
    if (!data || !Array.isArray(data.cart)) return [];
  
    return data.cart.map(item => {
      const orderID = item.orderID ?? 'Unknown';
      const productType = item.productType ?? 'Unknown';
  
      const conveyorName =
        item.productConfigurationInfo?.conveyorName ?? 'Unknown';
  
      const quantity = parseInt(
        item.numRequested?.['$numberInt'] ?? '0',
        10
      );
  
      const rawDate = item.orderCreated?.['$date']?.['$numberLong'];
      const createdDate = rawDate
        ? new Date(Number(rawDate)).toLocaleString()
        : 'Unknown';
  
      return {
        orderID,
        productType,
        conveyorName,
        quantity,
        createdDate
      };
    });
  }
  