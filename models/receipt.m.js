const mongoose = require('mongoose');

const ReceiptSchema = new mongoose.Schema({
  receiptCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  agencyCode: {
    type: String,
    required: true,
    trim: true
  },
  agencyName: {
    type: String,
    required: true,
    trim: true
  },
  agencyAddress: {
    type: String,
    required: true,
    trim: true
  },
  agencyPhone: {
    type: String,
    required: true,
    trim: true
  },
  agencyEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Invalid email format']
  },
  collectionDate: { 
    type: Date,
    required: true
  },
  amountCollected: { 
    type: Number,
    required: true,
    min: 0
  },
  note: { 
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true 
});

const Receipt = mongoose.model('Receipt', ReceiptSchema, 'receipts');

module.exports = Receipt;

