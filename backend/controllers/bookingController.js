const Booking = require('../models/Booking');
const Session = require('../models/Session');

// ================= BOOK SESSION =================

const bookSession = async (req, res) => {

    try {

        const { sessionId, expoId } = req.body;

        // CHECK SESSION EXISTS
        const session = await Session.findById(sessionId);

        if (!session) {

            return res.status(404).json({
                message: 'Session not found'
            });
        }

        // CHECK ALREADY BOOKED
        const existingBooking = await Booking.findOne({
            attendee: req.user.id,
            session: sessionId
        });

        if (existingBooking) {

            return res.status(400).json({
                message: 'You already booked this session'
            });
        }

        // CHECK CAPACITY
        if (session.registeredCount >= session.capacity) {

            return res.status(400).json({
                message: 'Session is full'
            });
        }

        // CREATE BOOKING
        const booking = await Booking.create({
            attendee: req.user.id,
            session: sessionId,
            expo: expoId
        });

        // UPDATE SESSION COUNT
        session.registeredCount += 1;

        await session.save();

        res.status(201).json({
            success: true,
            message: 'Session booked successfully',
            booking
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// ================= GET MY BOOKINGS =================

const getMyBookings = async (req, res) => {

    try {

        const bookings = await Booking.find({
            attendee: req.user.id
        })
            .populate('expo')
            .populate({
                path: 'session',
                populate: {
                    path: 'speaker',
                    select: 'name email'
                }
            })
            .sort({ createdAt: -1 });

        res.json(bookings);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// ================= CANCEL BOOKING =================

const cancelBooking = async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {

            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        // DELETE BOOKING
        await Booking.findByIdAndDelete(req.params.id);

        // UPDATE SESSION COUNT
        const session = await Session.findById(booking.session);

        if (session && session.registeredCount > 0) {

            session.registeredCount -= 1;

            await session.save();
        }

        res.json({
            success: true,
            message: 'Booking cancelled successfully'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// ================= GET ALL BOOKINGS =================

const getAllBookings = async (req, res) => {

    try {

        const bookings = await Booking.find()
            .populate('attendee', 'name email')
            .populate('expo', 'title')
            .populate('session', 'title')
            .sort({ createdAt: -1 });

        res.json(bookings);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// ================= BOOKING STATS =================

const getBookingStats = async (req, res) => {

    try {

        const totalBookings = await Booking.countDocuments();

        res.json({
            totalBookings
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// ================= EXPORTS =================

module.exports = {
    bookSession,
    getMyBookings,
    cancelBooking,
    getAllBookings,
    getBookingStats
};