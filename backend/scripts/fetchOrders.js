require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { connectDB, disconnectDB } = require('./db/connection');
const Order = require('./models/Order');

(async () => {
  try {
    await connectDB();

    // Dumping to users.json file. Taking from database and storing in a json, this maintains the current implementation
    const orders = await Order.find({}).lean();
    const outPath = path.join(__dirname, 'public', 'users.json');
    fs.writeFileSync(outPath, JSON.stringify({ orders }, null, 2));
    console.log(`${orders.length} Orders data has been written to ${outPath}`);
  } catch (error) {
    console.error('Error fetching orders:', error);
    process.exitCode = 1
  } finally {
    await disconnectDB();
  }
})();

/*

GN -
I am not sure if we need all of this information anymore, but I do not have time to review it all right now
I will check it out later, but for now I think the above code does everything the below code does, but just uses our new organization

// MongoDB Connection URI
const uri = 'mongodb+srv://lucascolbydowlen:3rIbPfyNGaGGOUsK@dash-cluster-1.upt8jyd.mongodb.net/Dashboard';

console.log('Attempting to connect to MongoDB Atlas...');

// Connect to MongoDB
mongoose.connect(uri)
  .then(async () => {
    console.log('Connected to MongoDB Atlas successfully!');
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Available collections:');
      collections.forEach(collection => console.log(` - ${collection.name}`));
    } catch (err) {
      console.error('Error listing collections:', err);
    }
    return fetchCollection();
  })
  .catch(err => {
    console.error('Could not connect to MongoDB Atlas:', err);
    process.exit(1);
  });

// Generic schema (accept any shape)
const genericSchema = new mongoose.Schema({}, { strict: false });

// Collection model
const CollectionModel = mongoose.model('CollectionModel', genericSchema, 'Collection');

// Fetch from "Collection" collection and write to public/users.json
async function fetchCollection() {
  try {
    console.log('Fetching from "Collection" collection...');
    
    const collection = await CollectionModel.find({}).exec();
    console.log(`Found ${collection.length} documents in the "Collection" collection.`);

    // Save to JSON file as { users: [...] }
    const filePath = path.join(__dirname, 'public', 'users.json');
    fs.writeFileSync(filePath, JSON.stringify({ users: collection }, null, 2));

    console.log(`Collection data saved to ${filePath}`);
  } catch (error) {
    console.error('Error fetching from Collection:', error);
  } finally {
    mongoose.connection.close();
  }
} 
*/