const mongoose = require('mongoose');
require('dotenv').config();

const expoSchema = new mongoose.Schema({}, { strict: false });
const Expo = mongoose.model('Expo', expoSchema, 'expos');

const updateExpo = async () => {
    try {
        // Connect using the same URI as server.js
        const uri = process.env.MONGO_URI;
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');
        
        // Update Minrals expo
        const result = await Expo.updateOne(
            { title: "Minrals" },
            { 
                $set: { 
                    ticketsEnabled: true,
                    totalTickets: 200,
                    ticketsSold: 0,
                    ticketPrices: { 
                        general: 500, 
                        vip: 1500, 
                        student: 300 
                    }
                } 
            }
        );
        
        console.log('Update result:', result);
        
        if (result.matchedCount === 0) {
            console.log('Expo "Minrals" not found! Searching all expos...');
            const allExpos = await Expo.find({}, { title: 1 });
            console.log('Available expos:', allExpos.map(e => e.title));
        } else {
            console.log('✅ Expo updated successfully!');
            
            // Verify
            const updated = await Expo.findOne({ title: "Minrals" });
            console.log('Updated expo:', {
                title: updated.title,
                ticketsEnabled: updated.ticketsEnabled,
                totalTickets: updated.totalTickets,
                ticketPrices: updated.ticketPrices
            });
        }
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

updateExpo();