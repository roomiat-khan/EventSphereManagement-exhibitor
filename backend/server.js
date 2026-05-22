const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const dns = require('dns');
const authRoutes = require('./routes/authRoutes');
const deadlineReminderJob = require('./utils/deadlineReminder');

dns.setServers(['8.8.8.8']);



dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

deadlineReminderJob();
// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/expos', require('./routes/expoRoutes'));
app.use('/api/booths', require('./routes/boothRoutes'));
app.use('/api/exhibitors', require('./routes/exhibitorRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/bookmarks', require('./routes/bookmarkRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.use('/api/auth', authRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});