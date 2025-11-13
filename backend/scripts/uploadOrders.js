const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB Atlas connection URI with correct case for database name
const uri = 'mongodb+srv://lucascolbydowlen:3rIbPfyNGaGGOUsK@dash-cluster-1.upt8jyd.mongodb.net/Dashboard';

console.log('Reading orders from the local JSON file...');
// Read the existing orders.json file
const ordersJsonPath = path.join(__dirname, 'src', 'orders.json');
let ordersData;

try {
  const data = fs.readFileSync(ordersJsonPath, 'utf8');
  ordersData = JSON.parse(data);
  console.log(`Found ${ordersData.orders.length} orders in the local file.`);
} catch (readError) {
  console.error('Error reading orders.json:', readError);
  process.exit(1);
}

console.log('Attempting to connect to MongoDB Atlas...');

// Connect to MongoDB
mongoose.connect(uri)
  .then(async () => {
    console.log('Connected to MongoDB Atlas successfully!');
    return uploadOrders(ordersData.orders);
  })
  .catch(err => {
    console.error('Could not connect to MongoDB Atlas:', err);
    process.exit(1);
  });

// Define the Order schema based on the existing orders.json structure
const orderSchema = new mongoose.Schema({
  id: String,
  user: String,
  part: String,
  status: String,
  quantity: Number
}, { strict: false });

const Order = mongoose.model('orders', orderSchema);

// Upload orders to MongoDB
async function uploadOrders(orders) {
  try {
    console.log('Uploading orders to MongoDB Atlas...');
    
    // Clear existing data (if any)
    await Order.deleteMany({});
    console.log('Cleared existing orders collection.');
    
    // Insert all orders
    const result = await Order.insertMany(orders);
    console.log(`Successfully uploaded ${result.length} orders to MongoDB Atlas.`);
    
    console.log('Orders have been successfully added to the database.');
  } catch (error) {
    console.error('Error uploading orders:', error);
  } finally {
    mongoose.connection.close();
  }
} 