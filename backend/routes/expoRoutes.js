const express = require('express');
const router = express.Router();
const {
    getExpos,
    getAllExposAdmin,
    getExpoById,
    createExpo,
    updateExpo,
    deleteExpo
} = require('../controllers/expoController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getExpos);                          // public
router.get('/admin', protect, adminOnly, getAllExposAdmin);  // admin only
router.get('/:id', getExpoById);                    // public
router.post('/', protect, adminOnly, createExpo);   // admin only
router.put('/:id', protect, adminOnly, updateExpo); // admin only
router.delete('/:id', protect, adminOnly, deleteExpo); // admin only

module.exports = router;