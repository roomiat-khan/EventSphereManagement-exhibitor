const User = require('../models/User');

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.companyName = req.body.companyName || user.companyName;

        if (req.body.companyDetails) {
            user.companyDetails = { ...user.companyDetails, ...req.body.companyDetails };
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { updateUserProfile };