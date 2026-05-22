const Session = require('../models/Session');

const getSessionsByExpo = async (req, res) => {

    try {

        const sessions = await Session.find({
            expo: req.params.expoId
        }).populate('expo');

        res.json(sessions);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

// GET single session
const getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate('expo', 'title location');

        if (!session)
            return res.status(404).json({
                message: 'Session not found'
            });

        res.json(session);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

// POST create session
const createSession = async (req, res) => {

    try {

        const session = await Session.create(req.body);

        res.status(201).json(session);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

// PUT update session
const updateSession = async (req, res) => {

    try {

        const session = await Session.findById(req.params.id);

        if (!session)
            return res.status(404).json({
                message: 'Session not found'
            });

        const updated = await Session.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updated);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

// DELETE session
const deleteSession = async (req, res) => {

    try {

        const session = await Session.findById(req.params.id);

        if (!session)
            return res.status(404).json({
                message: 'Session not found'
            });

        await session.deleteOne();

        res.json({
            message: 'Session deleted successfully'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

// GET all sessions
const getAllSessions = async (req, res) => {

    try {

        const sessions = await Session.find()
            .populate('expo', 'title')
            .sort({ startTime: 1 });

        res.json(sessions);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createSession,
    getSessionsByExpo,
    getSessionById,
    updateSession,
    deleteSession,
    getAllSessions
};