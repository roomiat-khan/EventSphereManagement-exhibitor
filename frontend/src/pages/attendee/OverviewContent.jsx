import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAttendeeStats } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const AttendeeOverview = ({ setActiveTab }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            const res = await getAttendeeStats();
            setStats(res.data);
        } catch (err) {
            toast.error('Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>Loading dashboard...</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    const typeStyle = (type) => ({
        talk:       { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1' },
        workshop:   { bg: 'rgba(16,185,129,0.1)',  color: '#059669' },
        panel:      { bg: 'rgba(139,92,246,0.1)',  color: '#7c3aed' },
        keynote:    { bg: 'rgba(245,158,11,0.1)',  color: '#d97706' },
        networking: { bg: 'rgba(236,72,153,0.1)',  color: '#db2777' },
    }[type] || { bg: 'rgba(148,163,184,0.1)', color: '#64748b' });

    const quickActions = [
        { label: 'Browse Expos',  icon: '🎪', desc: 'Explore upcoming expos',      tab: 'expos',     path: '/attendee/expos',    color: '#6366f1' },
        { label: 'Sessions',      icon: '📅', desc: 'Browse & book sessions',      tab: 'sessions',  path: '/attendee/sessions', color: '#06b6d4' },
        { label: 'My Bookings',   icon: '🎟️', desc: 'View all your bookings',      tab: 'bookings',  path: '/attendee/bookings', color: '#10b981' },
    ];

    const s = {
        page: { fontFamily: "'Segoe UI',system-ui,sans-serif" },

        // Banner
        banner: { background: 'linear-gradient(135deg,#0f172a,#1e1b4b)', borderRadius: '20px', padding: '28px 32px', marginBottom: '24px', position: 'relative', overflow: 'hidden' },
        bannerBg: { position: 'absolute', inset: 0, backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.25) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(6,182,212,0.15) 0%, transparent 50%)` },
        bannerContent: { position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' },
        bannerBadge: { display: 'inline-block', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '100px', marginBottom: '10px', letterSpacing: '0.05em' },
        bannerTitle: { fontSize: '20px', fontWeight: '900', color: 'white', margin: '0 0 4px 0', letterSpacing: '-0.5px' },
        bannerSub: { fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0 },
        browseBtn: { padding: '12px 24px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.3)', transition: 'all 0.2s', whiteSpace: 'nowrap' },

        // KPI
        kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' },
        kpiCard: { background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '16px' },
        kpiIcon: { width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 },
        kpiVal: { fontSize: '28px', fontWeight: '900', color: '#0f172a', lineHeight: '1' },
        kpiLabel: { fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '3px' },

        // Cards
        card: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '20px' },
        cardHead: { padding: '18px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        cardTitle: { fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: 0 },
        viewAllBtn: { fontSize: '12px', fontWeight: '700', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 10px', borderRadius: '6px', transition: 'background 0.15s' },

        // Booking rows
        bookRow: { padding: '14px 22px', borderBottom: '1px solid #f8fafc', transition: 'background 0.15s', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' },
        bookTitle: { fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' },
        bookMeta: { fontSize: '12px', color: '#64748b' },
        typePill: (type) => ({ background: typeStyle(type).bg, color: typeStyle(type).color, padding: '3px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: '700', textTransform: 'capitalize', whiteSpace: 'nowrap', flexShrink: 0 }),

        // Quick actions
        quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', padding: '16px 20px' },
        quickBtn: { padding: '18px', borderRadius: '16px', border: '1.5px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' },
        quickIcon: { fontSize: '24px', marginBottom: '10px', display: 'block' },
        quickLabel: { fontSize: '13px', fontWeight: '700', color: '#0f172a', display: 'block' },
        quickDesc: { fontSize: '11px', color: '#94a3b8', marginTop: '3px' },

        empty: { textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '13px' },
        emptyIcon: { fontSize: '32px', marginBottom: '8px' },
    };

    return (
        <div style={s.page}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    .at-kpi-grid   { grid-template-columns: 1fr 1fr !important; }
                    .at-quick-grid { grid-template-columns: 1fr 1fr !important; }
                }
                @media (max-width: 480px) {
                    .at-kpi-grid   { grid-template-columns: 1fr !important; }
                    .at-quick-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>

            {/* Banner */}
            <div style={s.banner}>
                <div style={s.bannerBg} />
                <div style={s.bannerContent}>
                    <div>
                        <div style={s.bannerBadge}>🎟️ ATTENDEE PORTAL</div>
                        <h2 style={s.bannerTitle}>
                            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]}! 👋
                        </h2>
                        <p style={s.bannerSub}>Discover expos, book sessions and manage your event experience.</p>
                    </div>
                    <button style={s.browseBtn}
                        onClick={() => { setActiveTab('expos'); navigate('/attendee/expos'); }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.4)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.3)'; }}
                    >🎪 Browse Expos</button>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={s.kpiGrid} className="at-kpi-grid">
                {[
                    { label: 'Available Expos',     value: stats?.totalExpos      ?? 0, icon: '🎪', grad: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
                    { label: 'Confirmed Bookings',  value: stats?.totalBookings   ?? 0, icon: '🎟️', grad: 'linear-gradient(135deg,#10b981,#059669)' },
                    { label: 'Cancelled Bookings',  value: stats?.cancelledBookings ?? 0, icon: '❌', grad: 'linear-gradient(135deg,#ef4444,#dc2626)' },
                ].map((k, i) => (
                    <div key={i} style={s.kpiCard}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        <div style={{ ...s.kpiIcon, background: k.grad }}>{k.icon}</div>
                        <div>
                            <div style={s.kpiVal}>{k.value}</div>
                            <div style={s.kpiLabel}>{k.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Bookings */}
            <div style={s.card}>
                <div style={s.cardHead}>
                    <h3 style={s.cardTitle}>🎟️ Recent Bookings</h3>
                    <button style={s.viewAllBtn}
                        onClick={() => { setActiveTab('bookings'); navigate('/attendee/bookings'); }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f5f3ff'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >View All →</button>
                </div>

                {!stats?.myBookings?.length ? (
                    <div style={s.empty}>
                        <div style={s.emptyIcon}>🎟️</div>
                        <div>No bookings yet. Browse sessions and book your spot!</div>
                    </div>
                ) : (
                    stats.myBookings.map((booking, i) => (
                        <div key={i} style={s.bookRow}
                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                            onMouseLeave={e => e.currentTarget.style.background = 'white'}
                        >
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={s.bookTitle}>{booking.session?.title}</p>
                                <p style={s.bookMeta}>
                                    🎪 {booking.expo?.title} &nbsp;·&nbsp;
                                    🎤 {booking.session?.speaker?.name} &nbsp;·&nbsp;
                                    📍 {booking.session?.location || 'TBD'}
                                </p>
                                <p style={{ ...s.bookMeta, marginTop: '3px' }}>
                                    🕐 {booking.session?.startTime
                                        ? new Date(booking.session.startTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                                        : 'TBD'}
                                </p>
                            </div>
                            <span style={s.typePill(booking.session?.type)}>
                                {booking.session?.type || 'session'}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* Quick Actions */}
            <div style={s.card}>
                <div style={s.cardHead}>
                    <h3 style={s.cardTitle}>⚡ Quick Actions</h3>
                </div>
                <div style={s.quickGrid} className="at-quick-grid">
                    {quickActions.map((a, i) => (
                        <button key={i} style={s.quickBtn}
                            onClick={() => { setActiveTab(a.tab); navigate(a.path); }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <span style={s.quickIcon}>{a.icon}</span>
                            <span style={s.quickLabel}>{a.label}</span>
                            <span style={s.quickDesc}>{a.desc}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AttendeeOverview;