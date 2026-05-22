const express = require('express');
const router  = express.Router();
const {
    bookTicket, getMyTickets, cancelTicket,
    getAllTickets, getTicketStats, markTicketUsed
} = require('../controllers/ticketController');
const { protect, adminOnly, authorizeRoles } = require('../middleware/authMiddleware');

// Attendee
router.post('/',          protect, authorizeRoles('attendee'), bookTicket);
router.get('/my',         protect, authorizeRoles('attendee'), getMyTickets);
router.put('/:id/cancel', protect, authorizeRoles('attendee'), cancelTicket);

// Admin
router.get('/',           protect, adminOnly, getAllTickets);
router.get('/stats',      protect, adminOnly, getTicketStats);
router.put('/:id/use',    protect, adminOnly, markTicketUsed);

module.exports = router;