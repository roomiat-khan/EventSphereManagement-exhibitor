const mongoose = require('mongoose');

const exhibitorSchema = new mongoose.Schema({
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
    companyName: String,
    products: [String],
    description: String,
    documents: [String],        // uploaded document URLs
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    assignedBooth: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booth'
    }
}, { timestamps: true });

const Exhibitor = mongoose.model('Exhibitor', exhibitorSchema);
module.exports = Exhibitor;