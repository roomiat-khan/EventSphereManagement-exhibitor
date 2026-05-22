const express = require('express');
const router = express.Router();
const { getAllUsers, generateTicket, generateTicketsForAllAttendees } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All routes are admin only
router.get('/users', protect, adminOnly, getAllUsers);
router.post('/generate-ticket', protect, adminOnly, generateTicket);
router.post('/generate-tickets-all', protect, adminOnly, generateTicketsForAllAttendees);

module.exports = router;