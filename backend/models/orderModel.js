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
    status: { type: String, enum: ['Requested', 'Pending', 'Complete'], default: 'Requested' },
    completionStatus: { type: String, default: 'Requested' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
