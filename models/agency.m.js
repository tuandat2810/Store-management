const mongoose = require('mongoose');

const AgencySchema = new mongoose.Schema({
    agencyCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    managerUsername: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: [1, 2] 
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    district: {
        type: String,
        required: true,
        trim: true
    },
    acceptedDate: {
        type: Date,
        required: true 
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/, 'Email không hợp lệ']
    },
    status: {
        type: String,
        enum: ["Đã duyệt", "Đang chờ", "Từ chối"],
        trim: true,
        required: true
    }
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});

const Agency = mongoose.model('Agency', AgencySchema, 'agencies');

module.exports = Agency;
