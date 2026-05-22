const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');

const Expo = require('../models/Expo');
const Booth = require('../models/Booth');
const ExhibitorProfile = require('../models/ExhibitorProfile');
const Session = require('../models/Session');
const Booking = require('../models/Booking');

router.get('/admin', protect, adminOnly, async (req, res) => {
    try {
        const [
            totalExpos,
            totalBooths,
            totalExhibitors,
            totalSessions,
            totalBookings,
            pendingApplications,
            recentExpos,
            availableBooths,
            occupiedBooths,
        ] = await Promise.all([
            Expo.countDocuments(),
            Booth.countDocuments(),
            ExhibitorProfile.countDocuments({ applicationStatus: 'approved' }),
            Session.countDocuments(),
            Booking.countDocuments({ status: 'confirmed' }),
            ExhibitorProfile.countDocuments({ applicationStatus: 'pending' }),
            Expo.find().sort({ createdAt: -1 }).limit(5).select('title status startDate location'),
            Booth.countDocuments({ status: 'available' }),
            Booth.countDocuments({ status: 'occupied' }),
        ]);

        res.json({
            totalExpos, totalBooths, totalExhibitors,
            totalSessions, totalBookings, pendingApplications,
            recentExpos, availableBooths, occupiedBooths,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/exhibitor', protect, async (req, res) => {
    try {
        const [
            myApplications,
            approvedApps,
            pendingApps,
        ] = await Promise.all([
            ExhibitorProfile.find({ user: req.user.id })
                .populate('expo', 'title location startDate endDate status registrationDeadline')
                .populate('booth', 'boothNumber size price status')
                .sort({ createdAt: -1 }),
            ExhibitorProfile.countDocuments({ user: req.user.id, applicationStatus: 'approved' }),
            ExhibitorProfile.countDocuments({ user: req.user.id, applicationStatus: 'pending' }),
        ]);

        res.json({ myApplications, approvedApps, pendingApps, totalApps: myApplications.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/attendee', protect, async (req, res) => {
    try {
        const [
            myBookings,
            totalExpos,
        ] = await Promise.all([
            Booking.find({ attendee: req.user.id, status: 'confirmed' })
                .populate('session', 'title startTime endTime location speaker type')
                .populate('expo', 'title location')
                .sort({ createdAt: -1 })
                .limit(5),
            Expo.countDocuments({ status: { $in: ['published', 'ongoing'] } }),
        ]);

        const totalBookings = await Booking.countDocuments({ attendee: req.user.id, status: 'confirmed' });
        const cancelledBookings = await Booking.countDocuments({ attendee: req.user.id, status: 'cancelled' });

        res.json({ myBookings, totalBookings, cancelledBookings, totalExpos });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;