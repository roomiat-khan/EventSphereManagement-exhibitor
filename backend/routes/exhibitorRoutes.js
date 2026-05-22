const express = require('express');

const router = express.Router();

const {
    applyAsExhibitor,
    getMyApplications,
    getExhibitorDashboardStats,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
    assignBooth
} = require('../controllers/exhibitorController');

const {
    protect,
    authorizeRoles
} = require('../middleware/authMiddleware');


// ====================================
// EXHIBITOR ROUTES
// ====================================

router.post(
    '/apply',
    protect,
    authorizeRoles('exhibitor'),
    applyAsExhibitor
);

router.get(
    '/my-applications',
    protect,
    authorizeRoles('exhibitor'),
    getMyApplications
);

router.get(
    '/dashboard-stats',
    protect,
    authorizeRoles('exhibitor'),
    getExhibitorDashboardStats
);


// ====================================
// ADMIN ROUTES
// ====================================

router.get(
    '/applications',
    protect,
    authorizeRoles('admin', 'organizer'),
    getAllApplications
);

router.get(
    '/applications/:id',
    protect,
    authorizeRoles('admin', 'organizer'),
    getApplicationById
);

router.put(
    '/applications/:id/status',
    protect,
    authorizeRoles('admin', 'organizer'),
    updateApplicationStatus
);

router.put(
    '/applications/:id/assign-booth',
    protect,
    authorizeRoles('admin', 'organizer'),
    assignBooth
);

module.exports = router;