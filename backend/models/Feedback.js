const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expo',
        default: null
    },
    type: {
        type: String,
        enum: ['general', 'bug', 'suggestion', 'complaint', 'compliment'],
        default: 'general'
    },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: null },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved'],
        default: 'pending'
    },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);