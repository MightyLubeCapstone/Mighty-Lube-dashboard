const mongoose = require('mongoose');

// 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
const state = {
  conn: null,
  promise: null,
};

async function connectDB(URI = process.env.MONGODB_URI) {
  if (!URI) throw new Error('Missing MongoDB URI');

  // Already connected
  if (mongoose.connection.readyState === 1 && state.conn) return state.conn;

  // If a connection is in progress, reuse the same promise
  if (!state.promise) {
    mongoose.set('strictQuery', true);

    state.promise = mongoose.connect(URI).then(() => {
      state.conn = mongoose.connection;
      console.log('Connected to MongoDB');
      return state.conn;
    }).catch((err) => {
      // Reset the promise so a subsequent call can retry
      state.promise = null;
      console.error('Could not connect to MongoDB:', err);
      // Re-throw so callers (server/scripts) can decide whether to exit
      throw err;
    });
  }

  return state.promise;
}

async function disconnectDB() {
  // For long-running servers you usually don't call this.
  // It’s handy for scripts/tests.
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    state.conn = null;
    state.promise = null;
    console.log('Disconnected from MongoDB');
  }
}

module.exports = { connectDB, disconnectDB };

/*

// In one-off scripts
const { connectDB, disconnectDB } = require('../db/connection');
await connectDB();
// ... do work ...
await disconnectDB();

*/