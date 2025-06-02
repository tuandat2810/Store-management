const mongoose = require('mongoose');

const AgencyTypeSchema = new mongoose.Schema({
    type: {
        type: Number,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    maximumDebt: {
        type: Number,
        required: true,
        min: 0 
    }
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});


const AgencyType = mongoose.model('AgencyType', AgencyTypeSchema, 'agencytypes');

module.exports = AgencyType;

