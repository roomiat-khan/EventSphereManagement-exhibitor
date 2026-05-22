const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
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
}, { timestamps: true });

// Prevent duplicate bookmarks
bookmarkSchema.index({ attendee: 1, session: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);