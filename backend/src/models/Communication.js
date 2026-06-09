const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  channel: { type: String, enum: ['WHATSAPP', 'SMS', 'EMAIL', 'RCS'], required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'SENT', 'DELIVERED', 'FAILED', 'OPENED', 'CLICKED'], default: 'PENDING' },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Communication', communicationSchema);
