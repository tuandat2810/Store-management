const mongoose = require('mongoose');

const DistrictSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    districtName: {
        type: String,
        required: true,
        trim: true
    },
    maximumAgenciesAvailable: {
        type: Number,
        default: 4
    }
}, {
    timestamps: true
});

const District = mongoose.model('District', DistrictSchema, 'districts');

module.exports = District;
