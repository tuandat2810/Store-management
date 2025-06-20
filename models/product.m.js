const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  image: {
    type: String,
    default: '',
    trim: true
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    default: 'Đơn'
  },
  category: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', ProductSchema, 'products');

module.exports = Product;
