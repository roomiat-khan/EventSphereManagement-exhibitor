const mongoose = require('mongoose');
require('dotenv').config();

// Simple schema for update
const expoSchema = new mongoose.Schema({}, { strict: false, collection: 'expos' });
const Expo = mongoose.model('Expo', expoSchema);

const run = async () => {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB Cloud');
        
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
        
        console.log('📝 Update result:', result);
        
        if (result.matchedCount === 0) {
            console.log('❌ Expo "Minrals" not found!');
            // Show all expos
            const allExpos = await Expo.find({}, { title: 1 });
            console.log('📋 Available expos:', allExpos.map(e => e.title));
        } else {
            console.log('✅ Expo updated successfully!');
        }
        
        // Verify
        const updated = await Expo.findOne({ title: "Minrals" });
        if (updated) {
            console.log('📋 Updated expo:', {
                title: updated.title,
                ticketsEnabled: updated.ticketsEnabled,
                totalTickets: updated.totalTickets,
                ticketPrices: updated.ticketPrices
            });
        }
        
        process.exit();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

run();