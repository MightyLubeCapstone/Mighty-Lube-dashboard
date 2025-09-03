// backend/models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderID: { type: String, index: true },
  productType: String,
  productConfigurationInfo: {
    conveyorName: String,
    productConfiguration: mongoose.Schema.Types.Mixed
  },
  numRequested: Number,
  orderStatus: {
    status: { type: String, enum: ['Processing', 'Completed', 'Pending', 'Unknown'], default: 'Unknown' },
    completionStatus: { type: String, default: 'Unknown' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
