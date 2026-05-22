const express = require('express');

const router = express.Router();

const {
    addBookmark,
    removeBookmark,
    getMyBookmarks,
    checkBookmark
} = require('../controllers/bookmarkController');

const {
    protect,
    authorizeRoles
} = require('../middleware/authMiddleware');

// ADD
router.post(
    '/',
    protect,
    authorizeRoles('attendee'),
    addBookmark
);

// REMOVE
router.delete(
    '/:sessionId',
    protect,
    authorizeRoles('attendee'),
    removeBookmark
);

// GET MY
router.get(
    '/my',
    protect,
    authorizeRoles('attendee'),
    getMyBookmarks
);

// CHECK
router.get(
    '/check/:sessionId',
    protect,
    authorizeRoles('attendee'),
    checkBookmark
);

module.exports = router;