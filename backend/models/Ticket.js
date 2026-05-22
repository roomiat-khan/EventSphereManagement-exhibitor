const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    expo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expo',
        required: true
    },
    attendee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ticketNumber: {
        type: String,
        unique: true,
    },
    ticketType: {
        type: String,
        enum: ['general', 'vip', 'student'],
        default: 'general'
    },
    price: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'used', 'cancelled'],
        default: 'active'
    },
    usedAt: {
        type: Date,
        default: null
    },
}, { timestamps: true });

// Auto generate ticket number
ticketSchema.pre('save', async function () {
    if (!this.ticketNumber) {
        const rand = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

        this.ticketNumber = `ES-${Date.now()}-${rand}`;
    }
});

module.exports = mongoose.model('Ticket', ticketSchema);