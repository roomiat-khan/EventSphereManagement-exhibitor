const Feedback = require('../models/Feedback');

// POST - Submit feedback
const submitFeedback = async (req, res) => {
    try {
        const { type, subject, message, rating, expo } = req.body;

        const feedback = await Feedback.create({
            user: req.user.id,
            expo: expo || null,
            type, subject, message, rating
        });

        res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET - User gets their own feedback
const getMyFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ user: req.user.id })
            .populate('expo', 'title')
            .sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET - Admin gets all feedback
const getAllFeedback = async (req, res) => {
    try {
        const { status, type } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (type) filter.type = type;

        const feedbacks = await Feedback.find(filter)
            .populate('user', 'name email role')
            .populate('expo', 'title')
            .sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT - Admin updates feedback status
const updateFeedbackStatus = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
        res.json({ message: 'Status updated', feedback });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { submitFeedback, getMyFeedback, getAllFeedback, updateFeedbackStatus };