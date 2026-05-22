const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    attendee: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    session: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Session', 
        required: true 
    },
    expo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Expo', 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['confirmed', 'cancelled', 'attended'],
        default: 'confirmed'
    },
    bookedAt: { 
        type: Date, 
        default: Date.now 
    },
    notes: { type: String },
}, { timestamps: true });

// Prevent duplicate bookings
bookingSchema.index({ attendee: 1, session: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);