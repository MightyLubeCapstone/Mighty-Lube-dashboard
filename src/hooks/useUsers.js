/**
 * Parses the MongoDB-style Extended JSON format cart data
 * and returns a clean, flat array of cart items. Supports either
 * a single user object with a `cart` field, an array of users, or
 * an object with a `users` array property.
 */
export function parseCartFromUserData(data) {
  // Helper: normalize a single cart item into the shape the UI expects
  const normalizeCartItem = (item) => {
    const orderID = item.orderID ?? 'Unknown';
    const productType = item.productType ?? 'Unknown';

    const conveyorName = item.productConfigurationInfo?.conveyorName ?? 'Unknown';

    // numRequested can be a number or Extended JSON { $numberInt: "..." }
    const rawNumRequested = item.numRequested;
    const quantity = typeof rawNumRequested === 'number'
      ? rawNumRequested
      : parseInt(rawNumRequested?.['$numberInt'] ?? '0', 10);

    // orderCreated can be ISO string or Extended JSON
    const rawDate = item.orderCreated;
    let createdDate = 'Unknown';
    if (typeof rawDate === 'string') {
      const d = new Date(rawDate);
      createdDate = isNaN(d.getTime()) ? 'Unknown' : d.toLocaleString();
    } else {
      const ext = rawDate?.['$date']?.['$numberLong'];
      createdDate = ext ? new Date(Number(ext)).toLocaleString() : 'Unknown';
    }

    return {
      orderID,
      productType,
      conveyorName,
      quantity,
      createdDate,
      productConfigurationInfo: item.productConfigurationInfo ?? null
    };
  };

const flattenUsersArray = (users) => {
  const all = [];
  for (const user of users) {
    // Check if user has configurations array (new structure)
    if (Array.isArray(user.configurations)) {
      for (const config of user.configurations) {
        const cart = config?.cart;
        if (Array.isArray(cart)) {
          for (const item of cart) {
            all.push({
              ...normalizeCartItem(item),
              username: user.username,
              userID: user.userID,
              configurationName: config?.configurationName ?? 'Unknown',
              configId: config?._id?.['$oid'] || config?._id || config?.id || null
            });
          }
        }
      }
    }
    // Fallback to old structure (productConfigurationInfo.cart)
    const cart = user?.productConfigurationInfo?.cart;
    if (Array.isArray(cart)) {
      for (const item of cart) {
        all.push({
          ...normalizeCartItem(item),
          username: user.username,
          userID: user.userID,
          configurationName: user.productConfigurationInfo?.configurationName ?? 'Unknown',
          configId: user.productConfigurationInfo?._id?.['$oid'] || user.productConfigurationInfo?._id || user.productConfigurationInfo?.id || null
        });
      }
    }
  }
  return all;
};

  // If array: treat as array of users and flatten all carts
  if (Array.isArray(data)) {
    return flattenUsersArray(data);
  }

  // If wrapped under { users: [...] }
  if (data && Array.isArray(data.users)) {
    return flattenUsersArray(data.users);
  }

  // If single object: fall back to previous behavior
  if (!data || !Array.isArray(data.cart)) return [];
  return data.cart.map(normalizeCartItem);
}
  