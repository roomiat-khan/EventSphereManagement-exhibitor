const Ticket = require('../models/Ticket');
const Expo   = require('../models/Expo');

// POST — Attendee books a ticket
const bookTicket = async (req, res) => {
    try {
        const { expoId, ticketType } = req.body;
        
        console.log('1. Request received:', { expoId, ticketType });

        const expo = await Expo.findById(expoId);
        if (!expo) {
            console.log('2. Expo not found');
            return res.status(404).json({ message: 'Expo not found' });
        }
        
        console.log('2. Expo found:', expo.title, 'ticketsEnabled:', expo.ticketsEnabled);

        if (!expo.ticketsEnabled) {
            console.log('3. Tickets not enabled');
            return res.status(400).json({ message: 'Tickets not enabled for this expo' });
        }

        if (expo.ticketsSold >= expo.totalTickets) {
            console.log('4. Sold out');
            return res.status(400).json({ message: 'Sorry! All tickets are sold out' });
        }

        const existing = await Ticket.findOne({ 
            expo: expoId, 
            attendee: req.user.id, 
            status: 'active' 
        });
        
        if (existing) {
            console.log('5. Already have ticket');
            return res.status(400).json({ message: 'You already have a ticket for this expo' });
        }

        const price = expo.ticketPrices && expo.ticketPrices[ticketType] ? expo.ticketPrices[ticketType] : 0;
        console.log('6. Price:', price);

        const ticket = await Ticket.create({
            expo: expoId,
            attendee: req.user.id,
            ticketType: ticketType,
            price: price,
        });
        
        console.log('7. Ticket created:', ticket._id);

        expo.ticketsSold = expo.ticketsSold + 1;
        await expo.save();
        
        console.log('8. Expo updated, ticketsSold:', expo.ticketsSold);

        res.status(201).json({ 
            success: true,
            message: 'Ticket booked successfully!', 
            ticket: ticket 
        });
        
    } catch (error) {
        console.error('ERROR:', error);
        res.status(500).json({ message: error.message });
    }
};

// GET — Attendee gets their tickets
const getMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ attendee: req.user.id })
            .populate('expo', 'title location startDate endDate theme status ticketPrices totalTickets ticketsSold')
            .sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE — Attendee cancels ticket
const cancelTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        if (ticket.attendee.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
        if (ticket.status === 'used') return res.status(400).json({ message: 'Cannot cancel a used ticket' });

        ticket.status = 'cancelled';
        await ticket.save();

        const expo = await Expo.findById(ticket.expo);
        if (expo && expo.ticketsSold > 0) {
            expo.ticketsSold -= 1;
            await expo.save();
        }

        res.json({ message: 'Ticket cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET — Admin gets all tickets (with filters)
const getAllTickets = async (req, res) => {
    try {
        const { expoId, status } = req.query;
        const filter = {};
        if (expoId) filter.expo = expoId;
        if (status)  filter.status = status;

        const tickets = await Ticket.find(filter)
            .populate('attendee', 'name email phone')
            .populate('expo', 'title location startDate totalTickets ticketsSold')
            .sort({ createdAt: -1 });

        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET — Admin gets ticket stats per expo
const getTicketStats = async (req, res) => {
    try {
        const expos = await Expo.find({ ticketsEnabled: true })
            .select('title location startDate totalTickets ticketsSold ticketPrices status');

        const stats = await Promise.all(expos.map(async (expo) => {
            const [active, used, cancelled] = await Promise.all([
                Ticket.countDocuments({ expo: expo._id, status: 'active' }),
                Ticket.countDocuments({ expo: expo._id, status: 'used' }),
                Ticket.countDocuments({ expo: expo._id, status: 'cancelled' }),
            ]);

            const revenue = (await Ticket.aggregate([
                { $match: { expo: expo._id, status: { $in: ['active', 'used'] } } },
                { $group: { _id: null, total: { $sum: '$price' } } }
            ]))[0]?.total || 0;

            return {
                expo,
                active,
                used,
                cancelled,
                revenue,
                remaining: expo.totalTickets - expo.ticketsSold,
                soldPercent: expo.totalTickets > 0 ? Math.round((expo.ticketsSold / expo.totalTickets) * 100) : 0,
            };
        }));

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT — Admin marks ticket as used
const markTicketUsed = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { status: 'used', usedAt: new Date() },
            { new: true }
        );
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        res.json({ message: 'Ticket marked as used', ticket });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// EXPORT ALL FUNCTIONS
module.exports = { 
    bookTicket, 
    getMyTickets, 
    cancelTicket, 
    getAllTickets, 
    getTicketStats, 
    markTicketUsed 
};