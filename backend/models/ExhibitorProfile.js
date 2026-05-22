const mongoose = require('mongoose');

const exhibitorProfileSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    expo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Expo', 
        required: true 
    },
    companyName: { type: String, required: true },
    description: { type: String },
    logo: { type: String },
    website: { type: String },
    category: { 
        type: String, 
        enum: ['technology', 'healthcare', 'education', 'finance', 'retail', 'food', 'other'],
        default: 'other'
    },
    address: { type: String },
    phone: { type: String },
    products: [{ type: String }],
    documents: [{ type: String }],
    applicationStatus: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    booth: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Booth', 
        default: null 
    },
    rejectionReason: { type: String },
    appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('ExhibitorProfile', exhibitorProfileSchema);