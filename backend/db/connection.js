/* 
This file just sets up functions for connecting and disconnecting to the database.
Just pass the URI, contained in the .env file, to the connect function and it will connect/disconnect respectively
*/

const mongoose = require('mongoose');
require('dotenv').config();



let cached = null

// Connect to MongoDB, you will need to pass in the URI when calling function
async function connectDB(URI = process.env.MONGODB_URI) {
    if (cached) return cached;
    if (!URI) throw new Error('Missing MongoDB URI');
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        cached = mongoose.connection
        console.log('Connected to MongoDB successfully!');
    } catch (error) {
        console.error('Could not connect to MongoDB:', error);
        process.exit(1);
    }
}


async function disconnectDB() {
    if (cached) {
        await mongoose.disconnect();
        cached = null;
    }
    try {
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB successfully!');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
    }
}

module.exports = { connectDB, disconnectDB };