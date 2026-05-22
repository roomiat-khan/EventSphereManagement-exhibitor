const ExhibitorProfile = require('../models/ExhibitorProfile');
const Booth = require('../models/Booth');


// ===============================
// APPLY AS EXHIBITOR
// ===============================

const applyAsExhibitor = async (req, res) => {

    try {

        const {
            expoId,
            companyName,
            description,
            category,
            website,
            address,
            phone,
            products
        } = req.body;

        const existing = await ExhibitorProfile.findOne({
            user: req.user.id,
            expo: expoId
        });

        if (existing) {

            return res.status(400).json({
                message: 'You have already applied for this expo'
            });
        }

        const application = await ExhibitorProfile.create({
            user: req.user.id,
            expo: expoId,
            companyName,
            description,
            category,
            website,
            address,
            phone,
            products: products || [],
            applicationStatus: 'pending'
        });

        res.status(201).json({
            message: 'Application submitted successfully',
            application
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


// ===============================
// MY APPLICATIONS
// ===============================

const getMyApplications = async (req, res) => {

    try {

        const applications = await ExhibitorProfile.find({
            user: req.user.id
        })
        .populate(
            'expo',
            'title startDate endDate location status registrationDeadline'
        )
        .populate(
            'booth',
            'boothNumber size price status'
        )
        .sort({ createdAt: -1 });

        res.json(applications);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


// ===============================
// EXHIBITOR DASHBOARD STATS
// ===============================

const getExhibitorDashboardStats = async (req, res) => {

    try {

        const applications = await ExhibitorProfile.find({
            user: req.user.id
        })
        .populate(
            'expo',
            'title startDate endDate location status registrationDeadline'
        )
        .populate(
            'booth',
            'boothNumber size price status'
        )
        .sort({ createdAt: -1 });

        const totalApplications = applications.length;

        const approvedApplications = applications.filter(
            app => app.applicationStatus === 'approved'
        ).length;

        const pendingApplications = applications.filter(
            app => app.applicationStatus === 'pending'
        ).length;

        const rejectedApplications = applications.filter(
            app => app.applicationStatus === 'rejected'
        ).length;

        const totalBooths = applications.filter(
            app => app.booth
        ).length;

        const totalInvestment = applications.reduce((total, app) => {

            return total + (app.booth?.price || 0);

        }, 0);

        res.json({
            totalApplications,
            approvedApplications,
            pendingApplications,
            rejectedApplications,
            totalBooths,
            totalInvestment,
            myApplications: applications
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


// ===============================
// ADMIN - GET ALL APPLICATIONS
// ===============================

const getAllApplications = async (req, res) => {

    try {

        const { status, expoId } = req.query;

        const filter = {};

        if (status) {
            filter.applicationStatus = status;
        }

        if (expoId) {
            filter.expo = expoId;
        }

        const applications = await ExhibitorProfile.find(filter)
            .populate('user', 'name email phone')
            .populate('expo', 'title startDate location')
            .populate('booth', 'boothNumber size')
            .sort({ createdAt: -1 });

        res.json(applications);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


// ===============================
// GET SINGLE APPLICATION
// ===============================

const getApplicationById = async (req, res) => {

    try {

        const application = await ExhibitorProfile.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('expo', 'title startDate endDate location')
            .populate('booth', 'boothNumber size price');

        if (!application) {

            return res.status(404).json({
                message: 'Application not found'
            });
        }

        res.json(application);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


// ===============================
// UPDATE STATUS
// ===============================

const updateApplicationStatus = async (req, res) => {

    try {

        const { status, rejectionReason } = req.body;

        const application = await ExhibitorProfile.findById(req.params.id);

        if (!application) {

            return res.status(404).json({
                message: 'Application not found'
            });
        }

        application.applicationStatus = status;

        if (status === 'rejected' && rejectionReason) {

            application.rejectionReason = rejectionReason;
        }

        await application.save();

        res.json({
            message: `Application ${status} successfully`,
            application
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


// ===============================
// ASSIGN BOOTH
// ===============================

const assignBooth = async (req, res) => {

    try {

        const { boothId } = req.body;

        const application = await ExhibitorProfile.findById(req.params.id);

        if (!application) {

            return res.status(404).json({
                message: 'Application not found'
            });
        }

        if (application.applicationStatus !== 'approved') {

            return res.status(400).json({
                message: 'Application must be approved first'
            });
        }

        const booth = await Booth.findById(boothId);

        if (!booth) {

            return res.status(404).json({
                message: 'Booth not found'
            });
        }

        if (booth.status !== 'available') {

            return res.status(400).json({
                message: 'Booth is not available'
            });
        }

        booth.status = 'occupied';

        booth.exhibitor = application.user;

        await booth.save();

        application.booth = boothId;

        await application.save();

        res.json({
            message: 'Booth assigned successfully',
            application
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    applyAsExhibitor,
    getMyApplications,
    getExhibitorDashboardStats,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
    assignBooth
};