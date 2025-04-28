const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB Connection URI
const uri = 'mongodb+srv://lucascolbydowlen:3rIbPfyNGaGGOUsK@dash-cluster-1.upt8jyd.mongodb.net/Dashboard';

console.log('Attempting to connect to MongoDB Atlas...');

// Connect to MongoDB
mongoose.connect(uri)
  .then(async () => {
    console.log('Connected to MongoDB Atlas successfully!');
    
    // List collections
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Available collections:');
      collections.forEach(collection => {
        console.log(` - ${collection.name}`);
      });
    } catch (err) {
      console.error('Error listing collections:', err);
    }
    
    return fetchOrders();
  })
  .catch(err => {
    console.error('Could not connect to MongoDB Atlas:', err);
    process.exit(1);
  });

const orderSchema = new mongoose.Schema({}, { strict: false });

const Order = mongoose.model('Order', orderSchema);
const Orders = mongoose.model('Orders', orderSchema, 'orders');

// Fetch all orders directly from MongoDB
async function fetchOrders() {
  try {
    console.log('Fetching orders from MongoDB Atlas...');
    
    // Try both potential collection names
    console.log('Trying "Order" collection...');
    let orders = await Order.find({}).exec();
    console.log(`Found ${orders.length} documents in the "Order" collection.`);
    
    if (orders.length === 0) {
      console.log('Trying "orders" collection...');
      orders = await Orders.find({}).exec();
      console.log(`Found ${orders.length} documents in the "orders" collection.`);
    }
    
    // Save to JSON file
    const filePath = path.join(__dirname, 'fullorders.json');
    fs.writeFileSync(filePath, JSON.stringify({ orders }, null, 2));
    
    console.log(`Orders saved to ${filePath}`);
  } catch (error) {
    console.error('Error fetching orders:', error);
  } finally {
    mongoose.connection.close();
  }
} 