const mongoose = require('mongoose');

const expoSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    theme: {
        type: String
    },

    banner: {
        type: String
    },

    // ==============================
    // NATURE OF EXHIBITION
    // ==============================

    natureOfExhibition: {

        type: String,

        enum: [
            'Technology',
            'Healthcare',
            'Education',
            'Finance',
            'Retail',
            'Food',
            'Fashion',
            'Automobile',
            'Real Estate',
            'Sports',
            'Agriculture',
            'Construction',
            'Tourism',
            'Entertainment',
            'Industrial',
            'Other'
        ],

        required: true,

        default: 'Technology'
    },

    // ==============================

    status: {

        type: String,

        enum: [
            'draft',
            'published',
            'ongoing',
            'completed',
            'cancelled'
        ],

        default: 'draft'
    },

    organizer: {

        type: mongoose.Schema.Types.ObjectId,

        ref: 'User',

        required: true
    },

    maxBooths: {
        type: Number,
        default: 50
    },

    registrationDeadline: {
        type: Date
    },

    // ==============================
    // TICKET SETTINGS
    // ==============================

    ticketsEnabled: {
        type: Boolean,
        default: false
    },

    totalTickets: {
        type: Number,
        default: 0
    },

    ticketsSold: {
        type: Number,
        default: 0
    },

    ticketPrices: {

        general: {
            type: Number,
            default: 0
        },

        vip: {
            type: Number,
            default: 0
        },

        student: {
            type: Number,
            default: 0
        }
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Expo', expoSchema);