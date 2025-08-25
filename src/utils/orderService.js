// This will serve as the placeholder for the http request to fetch the order data, we will need to make sure the information obtained is a javascript array of

export async function fetchOrders() {
    try {
        const response = await fetch('/fullorders.json');
        const data = await response.json();
        return data.orders || [];
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
  }