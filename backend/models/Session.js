const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    expo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Expo', 
        required: true 
    },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    speaker: {
        name: { type: String, required: true },
        bio: { type: String },
        avatar: { type: String },
    },
    topic: { type: String },
    location: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    capacity: { type: Number, default: 100 },
    registeredCount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    type: {
        type: String,
        enum: ['talk', 'workshop', 'panel', 'keynote', 'networking'],
        default: 'talk'
    },
    tags: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);  