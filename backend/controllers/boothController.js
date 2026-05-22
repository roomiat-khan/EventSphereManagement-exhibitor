const Booth = require('../models/Booth');

// GET all booths for an expo
const getBoothsByExpo = async (req, res) => {
    try {
        const booths = await Booth.find({ expo: req.params.expoId })
            .populate('exhibitor', 'name email companyName')
            .sort({ boothNumber: 1 });
        res.json(booths);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET single booth
const getBoothById = async (req, res) => {
    try {
        const booth = await Booth.findById(req.params.id)
            .populate('exhibitor', 'name email companyName')
            .populate('expo', 'title');
        if (!booth) return res.status(404).json({ message: 'Booth not found' });
        res.json(booth);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create booth (admin only)
const createBooth = async (req, res) => {
    try {
        const booth = await Booth.create(req.body);
        res.status(201).json(booth);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create multiple booths at once (admin only)
const createBulkBooths = async (req, res) => {
    try {
        const { expoId, rows, columns, price, size } = req.body;
        const booths = [];

        for (let r = 0; r < rows; r++) {
            const rowLetter = String.fromCharCode(65 + r); // A, B, C...
            for (let c = 1; c <= columns; c++) {
                booths.push({
                    expo: expoId,
                    boothNumber: `${rowLetter}${c}`,
                    size: size || 'medium',
                    price: price || 0,
                    status: 'available',
                    location: { row: rowLetter, column: c }
                });
            }
        }

        const created = await Booth.insertMany(booths);
        res.status(201).json({ 
            message: `${created.length} booths created`, 
            booths: created 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT update booth (admin only)
const updateBooth = async (req, res) => {
    try {
        const booth = await Booth.findById(req.params.id);
        if (!booth) return res.status(404).json({ message: 'Booth not found' });

        const updated = await Booth.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT reserve booth (exhibitor)
const reserveBooth = async (req, res) => {
    try {
        const booth = await Booth.findById(req.params.id);
        if (!booth) return res.status(404).json({ message: 'Booth not found' });
        if (booth.status !== 'available') {
            return res.status(400).json({ message: 'Booth is not available' });
        }

        booth.status = 'reserved';
        booth.exhibitor = req.user.id;
        await booth.save();

        res.json({ message: 'Booth reserved successfully', booth });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT release booth (admin or exhibitor)
const releaseBooth = async (req, res) => {
    try {
        const booth = await Booth.findById(req.params.id);
        if (!booth) return res.status(404).json({ message: 'Booth not found' });

        booth.status = 'available';
        booth.exhibitor = null;
        await booth.save();

        res.json({ message: 'Booth released successfully', booth });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE booth (admin only)
const deleteBooth = async (req, res) => {
    try {
        const booth = await Booth.findById(req.params.id);
        if (!booth) return res.status(404).json({ message: 'Booth not found' });

        await booth.deleteOne();
        res.json({ message: 'Booth deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getBoothsByExpo, 
    getBoothById, 
    createBooth, 
    createBulkBooths,
    updateBooth, 
    reserveBooth, 
    releaseBooth,
    deleteBooth 
};