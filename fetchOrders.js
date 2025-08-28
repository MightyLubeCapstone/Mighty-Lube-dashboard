const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB Connection URI
const uri = process.env.URI

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