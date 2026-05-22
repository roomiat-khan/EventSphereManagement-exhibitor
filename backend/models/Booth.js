const mongoose = require('mongoose');

const boothSchema = new mongoose.Schema({
    expo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Expo', 
        required: true 
    },
    boothNumber: { 
        type: String, 
        required: true 
    },
    size: { 
        type: String, 
        enum: ['small', 'medium', 'large'], 
        default: 'medium' 
    },
    price: { 
        type: Number, 
        required: true, 
        default: 0 
    },
    status: { 
        type: String, 
        enum: ['available', 'reserved', 'occupied'], 
        default: 'available' 
    },
    exhibitor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        default: null 
    },
    location: {
        row: { type: String },
        column: { type: Number }
    },
    description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Booth', boothSchema);