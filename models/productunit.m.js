const mongoose = require('mongoose');

const ProductUnitSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true,
        unique: true
    }
});

const ProductUnit = mongoose.model('ProductUnit', ProductUnitSchema, 'productunits');

module.exports = ProductUnit;