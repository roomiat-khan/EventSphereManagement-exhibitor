const express = require('express');

const router = express.Router();

const {
    bookSession,
    getMyBookings,
    cancelBooking,
    getAllBookings,
    getBookingStats
} = require('../controllers/bookingController');

const {
    protect,
    adminOnly
} = require('../middleware/authMiddleware');

// ================= USER ROUTES =================

// Book session
router.post('/', protect, bookSession);

// Get my bookings
router.get('/my', protect, getMyBookings);

// Cancel booking
router.delete('/:id', protect, cancelBooking);

// ================= ADMIN ROUTES =================

router.get('/', protect, adminOnly, getAllBookings);

router.get('/stats', protect, adminOnly, getBookingStats);

module.exports = router;