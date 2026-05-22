const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.SECRET_KEY,
    },
});

// @desc    Register user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, phone, companyName } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'attendee',
            phone,
            companyName
        });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved,
                token: generateToken(user._id, user.role)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Forgot password — generate reset token & send email
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email' });
        }

        // Generate random reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash it before saving to DB
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Save to user — expires in 15 minutes
        user.resetPasswordToken   = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        // Reset link for frontend
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: `"EventSphere" <${process.env.EMAIL}>`,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Segoe UI, sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
                    <h2 style="color: #0f172a; margin-bottom: 8px;">Reset Your Password</h2>
                    <p style="color: #64748b; margin-bottom: 24px;">
                        Hi <strong>${user.name}</strong>, we received a request to reset your password.
                        Click the button below — this link expires in <strong>15 minutes</strong>.
                    </p>
                    <a href="${resetUrl}"
                        style="display: inline-block; padding: 12px 28px;
                               background: linear-gradient(135deg, #6366f1, #8b5cf6);
                               color: white; text-decoration: none;
                               border-radius: 8px; font-weight: 700; font-size: 15px;">
                        Reset Password
                    </a>
                    <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
                        If you didn't request this, please ignore this email.
                    </p>
                </div>
            `,
        });

        res.json({ message: 'Password reset link sent to your email' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset password — verify token & update password
// @route   POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Hash the incoming token to compare with DB
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with valid (not expired) token
        const user = await User.findOne({
            resetPasswordToken  : hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Update password — pre-save hook in User model will hash it
        user.password             = password;
        user.resetPasswordToken   = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful. You can now log in.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, forgotPassword, resetPassword };

