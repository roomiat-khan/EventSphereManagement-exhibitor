const cron = require('node-cron');
const Expo = require('../models/Expo');
const ExhibitorProfile = require('../models/ExhibitorProfile');
const sendEmail = require('./sendEmail');

const deadlineReminderJob = () => {
    // Runs every day at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
        console.log('⏰ Running deadline reminder job...');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Get all published expos with a registration deadline
            const expos = await Expo.find({
                status: { $in: ['published', 'ongoing'] },
                registrationDeadline: { $exists: true, $ne: null }
            });

            for (const expo of expos) {
                const deadline = new Date(expo.registrationDeadline);
                deadline.setHours(0, 0, 0, 0);

                const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

                // Only send on 7, 3, 1 days left
                if (![7, 3, 1].includes(daysLeft)) continue;

                // Get approved exhibitors for this expo
                const applications = await ExhibitorProfile.find({
                    expo: expo._id,
                    applicationStatus: 'approved'
                }).populate('user', 'name email');

                for (const app of applications) {
                    if (!app.user?.email) continue;

                    const urgencyColor = daysLeft === 1 ? '#dc2626' : daysLeft === 3 ? '#d97706' : '#059669';
                    const urgencyText = daysLeft === 1 ? '🔴 URGENT' : daysLeft === 3 ? '🟡 Soon' : '🟢 Reminder';

                    const html = `
                    <!DOCTYPE html>
                    <html>
                    <head><meta charset="UTF-8"></head>
                    <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',system-ui,sans-serif;">
                        <div style="max-width:560px;margin:40px auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                            
                            <!-- Header -->
                            <div style="background:linear-gradient(135deg,#0f172a,#1e1b4b);padding:36px 40px;text-align:center;">
                                <div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:16px;">
                                    <div style="width:36px;height:36px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:10px;display:inline-flex;align-items:center;justify-content:center;font-weight:900;color:white;font-size:14px;">ES</div>
                                    <span style="font-size:20px;font-weight:800;color:white;">EventSphere</span>
                                </div>
                                <div style="display:inline-block;background:rgba(99,102,241,0.2);border:1px solid rgba(99,102,241,0.4);color:#a5b4fc;font-size:12px;font-weight:700;padding:4px 14px;border-radius:100px;letter-spacing:0.05em;">
                                    ${urgencyText} — Registration Deadline
                                </div>
                            </div>

                            <!-- Body -->
                            <div style="padding:36px 40px;">
                                <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 8px 0;letter-spacing:-0.5px;">
                                    ⏰ ${daysLeft} Day${daysLeft > 1 ? 's' : ''} Left!
                                </h2>
                                <p style="font-size:15px;color:#64748b;margin:0 0 24px 0;line-height:1.6;">
                                    Hi <strong style="color:#0f172a;">${app.user.name}</strong>, the registration deadline for your expo is approaching fast.
                                </p>

                                <!-- Expo Card -->
                                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:24px;margin-bottom:24px;">
                                    <h3 style="font-size:18px;font-weight:800;color:#0f172a;margin:0 0 12px 0;">🎪 ${expo.title}</h3>
                                    <table style="width:100%;border-collapse:collapse;">
                                        <tr>
                                            <td style="padding:6px 0;font-size:13px;color:#64748b;width:140px;">📍 Location</td>
                                            <td style="padding:6px 0;font-size:13px;color:#0f172a;font-weight:600;">${expo.location}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:6px 0;font-size:13px;color:#64748b;">📅 Expo Dates</td>
                                            <td style="padding:6px 0;font-size:13px;color:#0f172a;font-weight:600;">
                                                ${new Date(expo.startDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })} 
                                                → 
                                                ${new Date(expo.endDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding:6px 0;font-size:13px;color:#64748b;">🏢 Your Booth</td>
                                            <td style="padding:6px 0;font-size:13px;color:#0f172a;font-weight:600;">${app.booth ? `Booth ${app.booth}` : 'To be assigned'}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:6px 0;font-size:13px;color:#64748b;">🏷️ Company</td>
                                            <td style="padding:6px 0;font-size:13px;color:#0f172a;font-weight:600;">${app.companyName}</td>
                                        </tr>
                                    </table>
                                </div>

                                <!-- Deadline Alert -->
                                <div style="background:${urgencyColor}10;border:1px solid ${urgencyColor}30;border-radius:12px;padding:16px 20px;margin-bottom:28px;display:flex;align-items:center;gap:12px;">
                                    <div style="font-size:28px;">${daysLeft === 1 ? '🚨' : daysLeft === 3 ? '⚠️' : '📢'}</div>
                                    <div>
                                        <div style="font-size:14px;font-weight:800;color:${urgencyColor};">
                                            Registration closes in ${daysLeft} day${daysLeft > 1 ? 's' : ''}
                                        </div>
                                        <div style="font-size:12px;color:#64748b;margin-top:2px;">
                                            Deadline: ${new Date(expo.registrationDeadline).toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>

                                <!-- CTA -->
                                <div style="text-align:center;">
                                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/exhibitor/dashboard"
                                       style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:14px;font-weight:700;box-shadow:0 4px 16px rgba(99,102,241,0.3);">
                                        View My Dashboard →
                                    </a>
                                </div>
                            </div>

                            <!-- Footer -->
                            <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
                                <p style="font-size:12px;color:#94a3b8;margin:0;">
                                    © 2026 <strong style="color:#6366f1;">EventSphere</strong> — You're receiving this because you're a registered exhibitor.
                                </p>
                            </div>
                        </div>
                    </body>
                    </html>
                    `;

                    await sendEmail({
                        to: app.user.email,
                        subject: `⏰ ${daysLeft} Day${daysLeft > 1 ? 's' : ''} Left — ${expo.title} Registration Deadline`,
                        html,
                    });

                    console.log(`✅ Reminder sent to ${app.user.email} — ${daysLeft} days left for ${expo.title}`);
                }
            }

            console.log('✅ Deadline reminder job completed');
        } catch (error) {
            console.error('❌ Reminder job error:', error.message);
        }
    });
};

module.exports = deadlineReminderJob;