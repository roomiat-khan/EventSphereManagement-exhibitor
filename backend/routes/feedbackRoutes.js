const express = require('express');
const router = express.Router();
const { submitFeedback, getMyFeedback, getAllFeedback, updateFeedbackStatus } = require('../controllers/feedbackController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/',         protect, submitFeedback);
router.get('/my',        protect, getMyFeedback);
router.get('/',          protect, adminOnly, getAllFeedback);
router.put('/:id',       protect, adminOnly, updateFeedbackStatus);

module.exports = router;