const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productCode: {
    type: String,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  }
}, { _id: false }); 

const orderSchema = new mongoose.Schema({
  orderCode: {
    type: String,
    required: true,
    unique: true
  },
  agencyCode: {
    type: String,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  products: {
    type: [productSchema],
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  }
});

const Order = mongoose.model('Order', orderSchema, 'orders');

module.exports = Order;

