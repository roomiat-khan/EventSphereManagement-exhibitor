const Notification = require('../models/Notification');

const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 }).limit(50);
        res.json(notifications);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ message: 'Marked as read' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const markAllRead = async (req, res) => {
    try {
        await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
        res.json({ message: 'All marked as read' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteNotification = async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const createNotification = async (userId, title, message, type = 'info', link = null) => {
    try {
        await Notification.create({ user: userId, title, message, type, link });
    } catch (error) { console.error('Notification error:', error.message); }
};

module.exports = { getMyNotifications, markAsRead, markAllRead, deleteNotification, createNotification };