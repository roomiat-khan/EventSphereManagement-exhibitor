const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const Expo = require('../models/Expo');
const Booth = require('../models/Booth');
const ExhibitorProfile = require('../models/ExhibitorProfile');
const Session = require('../models/Session');
const Booking = require('../models/Booking');

router.get('/download', protect, adminOnly, async (req, res) => {
    try {
        const [expos, booths, exhibitors, sessions, bookings] = await Promise.all([
            Expo.countDocuments(),
            Booth.countDocuments(),
            ExhibitorProfile.countDocuments({ applicationStatus: 'approved' }),
            Session.countDocuments(),
            Booking.countDocuments({ status: 'confirmed' }),
        ]);

        const recentExpos = await Expo.find().sort({ createdAt: -1 }).limit(10).select('title location status startDate endDate');
        const pendingApps = await ExhibitorProfile.countDocuments({ applicationStatus: 'pending' });
        const availableBooths = await Booth.countDocuments({ status: 'available' });
        const occupiedBooths = await Booth.countDocuments({ status: 'occupied' });

        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=EventSphere-Report-${new Date().toISOString().split('T')[0]}.pdf`);
        doc.pipe(res);

        // Header
        doc.rect(0, 0, doc.page.width, 100).fill('#0f172a');
        doc.fillColor('white').fontSize(24).font('Helvetica-Bold').text('EventSphere', 50, 30);
        doc.fontSize(12).font('Helvetica').fillColor('#818cf8').text('Analytics & Reports', 50, 60);
        doc.fillColor('#94a3b8').fontSize(10).text(`Generated: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 50, 78);

        doc.moveDown(3);

        // Summary Section
        doc.fillColor('#0f172a').fontSize(16).font('Helvetica-Bold').text('Platform Summary', 50, 120);
        doc.moveTo(50, 140).lineTo(545, 140).strokeColor('#e2e8f0').lineWidth(1).stroke();

        const stats = [
            ['Total Expos', expos],
            ['Total Booths', booths],
            ['Available Booths', availableBooths],
            ['Occupied Booths', occupiedBooths],
            ['Approved Exhibitors', exhibitors],
            ['Pending Applications', pendingApps],
            ['Total Sessions', sessions],
            ['Confirmed Bookings', bookings],
        ];

        let y = 155;
        let col = 0;
        stats.forEach(([label, value], i) => {
            const x = col === 0 ? 50 : 300;
            doc.rect(x, y, 230, 50).fillColor('#f8fafc').fill();
            doc.rect(x, y, 4, 50).fillColor('#6366f1').fill();
            doc.fillColor('#94a3b8').fontSize(9).font('Helvetica').text(label.toUpperCase(), x + 14, y + 8);
            doc.fillColor('#0f172a').fontSize(22).font('Helvetica-Bold').text(String(value), x + 14, y + 22);
            col++;
            if (col === 2) { col = 0; y += 62; }
        });

        // Recent Expos Table
        y += 30;
        doc.fillColor('#0f172a').fontSize(16).font('Helvetica-Bold').text('Recent Expos', 50, y);
        y += 20;
        doc.moveTo(50, y).lineTo(545, y).strokeColor('#e2e8f0').lineWidth(1).stroke();
        y += 12;

        // Table Header
        doc.rect(50, y, 495, 28).fillColor('#0f172a').fill();
        doc.fillColor('white').fontSize(9).font('Helvetica-Bold');
        doc.text('EXPO TITLE', 60, y + 9);
        doc.text('LOCATION', 230, y + 9);
        doc.text('STATUS', 370, y + 9);
        doc.text('START DATE', 440, y + 9);
        y += 28;

        recentExpos.forEach((expo, i) => {
            const rowBg = i % 2 === 0 ? '#f8fafc' : 'white';
            doc.rect(50, y, 495, 26).fillColor(rowBg).fill();
            doc.fillColor('#0f172a').fontSize(9).font('Helvetica');
            doc.text(expo.title?.substring(0, 28) || '—', 60, y + 8);
            doc.text(expo.location?.substring(0, 18) || '—', 230, y + 8);
            doc.text(expo.status || '—', 370, y + 8);
            doc.text(expo.startDate ? new Date(expo.startDate).toLocaleDateString() : '—', 440, y + 8);
            y += 26;
        });

        // Footer
        doc.rect(0, doc.page.height - 50, doc.page.width, 50).fillColor('#0f172a').fill();
        doc.fillColor('#64748b').fontSize(9).font('Helvetica').text('© 2026 EventSphere Management System — Confidential', 50, doc.page.height - 30);

        doc.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;