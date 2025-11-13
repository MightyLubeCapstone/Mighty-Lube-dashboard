require('dotenv').config();
const fs = require('fs');
const { connectDB, disconnectDB } = require('../db/connection');
const Order = require('../models/Order');

(async () => {
  const file = process.argv[2]; // e.g., node scripts/fullOrders.js ./seed/orders.json
  if (!file) {
    console.error('Usage: node scripts/fullOrders.js ./path/to/orders.json');
    process.exit(1);
  }

  try {
    await connectDB();

    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    const orders = Array.isArray(raw) ? raw : raw.orders;
    if (!Array.isArray(orders)) throw new Error('Input must be an array or { orders: [...] }');

    await Order.deleteMany({});
    const result = await Order.insertMany(orders);
    console.log(`Inserted ${result.length} orders.`);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
})();
