const Expo = require('../models/Expo');

// GET all expos (public)
const getExpos = async (req, res) => {
    try {
        const expos = await Expo.find({ status: { $ne: 'draft' } })
            .populate('organizer', 'name email')
            .sort({ startDate: 1 });
        res.json(expos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET all expos for admin (including drafts)
const getAllExposAdmin = async (req, res) => {
    try {
        const expos = await Expo.find()
            .populate('organizer', 'name email')
            .sort({ createdAt: -1 });
        res.json(expos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET single expo
const getExpoById = async (req, res) => {
    try {
        const expo = await Expo.findById(req.params.id)
            .populate('organizer', 'name email');
        if (!expo) return res.status(404).json({ message: 'Expo not found' });
        res.json(expo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create expo (admin/organizer only)
const createExpo = async (req, res) => {
    try {
        const expo = await Expo.create({
            ...req.body,
            organizer: req.user.id
        });
        res.status(201).json(expo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT update expo
const updateExpo = async (req, res) => {
    try {
        const expo = await Expo.findById(req.params.id);
        if (!expo) return res.status(404).json({ message: 'Expo not found' });

        const updated = await Expo.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE expo
const deleteExpo = async (req, res) => {
    try {
        const expo = await Expo.findById(req.params.id);
        if (!expo) return res.status(404).json({ message: 'Expo not found' });

        await expo.deleteOne();
        res.json({ message: 'Expo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getExpos, getAllExposAdmin, getExpoById, createExpo, updateExpo, deleteExpo };