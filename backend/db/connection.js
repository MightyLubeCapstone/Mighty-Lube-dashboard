/* 
This file just sets up functions for connecting and disconnecting to the database.
Just pass the URI, contained in the .env file, to the connect function and it will connect/disconnect respectively
*/

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection URI
const URI = process.env.MONGODB_URI

// Connect to MongoDB
async function connectDB(URI) {
    try {
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB successfully!');
    } catch (error) {
        console.error('Could not connect to MongoDB:', error);
        process.exit(1);
    }
}


async function disconnectDB() {
    try {
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB successfully!');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
    }
}

module.exports = { connectDB, disconnectDB };