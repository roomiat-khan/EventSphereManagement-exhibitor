const User = require('../models/User');
const Expo = require('../models/Expo');
const Ticket = require('../models/Ticket');

// GET /api/admin/users - Get all attendees
const getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const filter = {};
        if (role) filter.role = role;
        
        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 });
        
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/admin/generate-ticket - Single ticket (OLD - keep for compatibility)
const generateTicket = async (req, res) => {
    try {
        const { attendeeId, expoId, ticketType } = req.body;
        
        if (!attendeeId || !expoId || !ticketType) {
            return res.status(400).json({ message: 'Please provide attendeeId, expoId, and ticketType' });
        }
        
        const attendee = await User.findById(attendeeId);
        if (!attendee) {
            return res.status(404).json({ message: 'Attendee not found' });
        }
        
        const expo = await Expo.findById(expoId);
        if (!expo) {
            return res.status(404).json({ message: 'Expo not found' });
        }
        
        if (!expo.ticketsEnabled) {
            return res.status(400).json({ message: 'Tickets are not enabled for this expo' });
        }
        
        if (expo.ticketsSold >= expo.totalTickets) {
            return res.status(400).json({ message: 'All tickets are sold out' });
        }
        
        const existingTicket = await Ticket.findOne({
            expo: expoId,
            attendee: attendeeId,
            status: 'active'
        });
        
        if (existingTicket) {
            return res.status(400).json({ message: 'Attendee already has an active ticket' });
        }
        
        const price = expo.ticketPrices?.[ticketType] ?? 0;
        
        const ticket = await Ticket.create({
            expo: expoId,
            attendee: attendeeId,
            ticketType,
            price,
            totalTickets: expo.totalTickets,
            status: 'active'
        });
        
        expo.ticketsSold += 1;
        await expo.save();
        
        const populatedTicket = await Ticket.findById(ticket._id)
            .populate('expo', 'title location startDate endDate theme')
            .populate('attendee', 'name email phone');
        
        res.status(201).json({ 
            success: true, 
            message: 'Ticket generated successfully!',
            ticket: populatedTicket 
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/admin/generate-tickets-all - Generate tickets for ALL attendees
const generateTicketsForAllAttendees = async (req, res) => {
    try {
        const { expoId, ticketType } = req.body;
        
        if (!expoId || !ticketType) {
            return res.status(400).json({ message: 'Please provide expoId and ticketType' });
        }
        
        const expo = await Expo.findById(expoId);
        if (!expo) {
            return res.status(404).json({ message: 'Expo not found' });
        }
        
        if (!expo.ticketsEnabled) {
            return res.status(400).json({ message: 'Tickets are not enabled for this expo. Please enable tickets first.' });
        }
        
        const attendees = await User.find({ role: 'attendee' });
        
        if (attendees.length === 0) {
            return res.status(400).json({ message: 'No attendees found in the system' });
        }
        
        const availableTickets = expo.totalTickets - expo.ticketsSold;
        if (availableTickets < attendees.length) {
            return res.status(400).json({ 
                message: `Not enough tickets available. Need ${attendees.length} but only ${availableTickets} left.` 
            });
        }
        
        const price = expo.ticketPrices?.[ticketType] ?? 0;
        let createdCount = 0;
        let skippedCount = 0;
        
        for (const attendee of attendees) {
            const existingTicket = await Ticket.findOne({
                expo: expoId,
                attendee: attendee._id,
                status: 'active'
            });
            
            if (existingTicket) {
                skippedCount++;
                continue;
            }
            
            await Ticket.create({
                expo: expoId,
                attendee: attendee._id,
                ticketType,
                price,
                totalTickets: expo.totalTickets,
                status: 'active'
            });
            
            createdCount++;
            expo.ticketsSold += 1;
        }
        
        await expo.save();
        
        res.status(201).json({ 
            success: true, 
            message: `Tickets generated: ${createdCount} created, ${skippedCount} skipped`,
            created: createdCount,
            skipped: skippedCount
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers, generateTicket, generateTicketsForAllAttendees };