import ordersJSON from '../test.json'; // Import the JSON data; this should be deleted when the function becomes a fetch request
// This will serve as the placeholder for the http request to fetch the order data, we will need to make sure the information obtained is a javascript array of

export async function fetchOrders() {
    return ordersJSON;
  }