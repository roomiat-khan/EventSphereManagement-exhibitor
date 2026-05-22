const express = require('express');
const router = express.Router();
const {
    getSessionsByExpo,
    getSessionById,
    createSession,
    updateSession,
    deleteSession,
    getAllSessions
} = require('../controllers/sessionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getAllSessions);         // admin only
router.get('/expo/:expoId', getSessionsByExpo);             // public
router.get('/:id', getSessionById);                         // public
router.post('/', protect, adminOnly, createSession);        // admin only
router.put('/:id', protect, adminOnly, updateSession);      // admin only
router.delete('/:id', protect, adminOnly, deleteSession);   // admin only

module.exports = router;