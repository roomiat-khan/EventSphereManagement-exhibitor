const express = require('express');
const router = express.Router();
const {
    getBoothsByExpo,
    getBoothById,
    createBooth,
    createBulkBooths,
    updateBooth,
    reserveBooth,
    releaseBooth,
    deleteBooth
} = require('../controllers/boothController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/expo/:expoId', getBoothsByExpo);                        // public
router.get('/:id', getBoothById);                                    // public
router.post('/', protect, adminOnly, createBooth);                   // admin only
router.post('/bulk', protect, adminOnly, createBulkBooths);          // admin only
router.put('/:id', protect, adminOnly, updateBooth);                 // admin only
router.put('/:id/reserve', protect, reserveBooth);                   // exhibitor
router.put('/:id/release', protect, releaseBooth);                   // admin/exhibitor
router.delete('/:id', protect, adminOnly, deleteBooth);              // admin only

module.exports = router;