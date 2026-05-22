import { useState, useEffect } from 'react';
import { getAllExposAdmin, getBookingStats, getAllApplications } from '../../services/api';
import { toast } from 'react-toastify';
import { downloadReport } from '../../services/api';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [expos, setExpos] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        try {
            const [exposRes, bookingRes, appRes] = await Promise.all([
                getAllExposAdmin(),
                getBookingStats(),
                getAllApplications(),
            ]);
            setExpos(exposRes.data);
            setStats(bookingRes.data);
            setApplications(appRes.data);
        } catch (error) {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px' }}>
            <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                border: '4px solid #6366f1', borderTopColor: 'transparent',
                animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    const exposByStatus = {
        draft     : expos.filter(e => e.status === 'draft').length,
        published : expos.filter(e => e.status === 'published').length,
        ongoing   : expos.filter(e => e.status === 'ongoing').length,
        completed : expos.filter(e => e.status === 'completed').length,
    };

    const appsByStatus = {
        pending  : applications.filter(a => a.applicationStatus === 'pending').length,
        approved : applications.filter(a => a.applicationStatus === 'approved').length,
        rejected : applications.filter(a => a.applicationStatus === 'rejected').length,
    };

    const statusStyle = (status) => {
        const map = {
            published : { background: 'rgba(99,102,241,0.1)',  border: '1px solid rgba(99,102,241,0.3)',  color: '#6366f1' },
            ongoing   : { background: 'rgba(16,185,129,0.1)',  border: '1px solid rgba(16,185,129,0.3)',  color: '#059669' },
            completed : { background: 'rgba(139,92,246,0.1)',  border: '1px solid rgba(139,92,246,0.3)',  color: '#7c3aed' },
            cancelled : { background: 'rgba(239,68,68,0.1)',   border: '1px solid rgba(239,68,68,0.3)',   color: '#dc2626' },
            draft     : { background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.3)', color: '#64748b' },
        };
        return map[status] || map.draft;
    };

    const handleDownload = async () => {
    try {
        const res = await downloadReport();
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = `EventSphere-Report-${new Date().toISOString().split('T')[0]}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
    } catch { toast.error('Failed to download report'); }
};

<button onClick={handleDownload} style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
    📥 Download PDF Report
</button>

    /* ── styles ─────────────────────────────────────────────── */
    const s = {
        page : { display: 'flex', flexDirection: 'column', gap: '24px' },

        /* page header */
        pageTitle : { fontSize: '22px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px', margin: '0 0 4px 0' },
        pageSub   : { fontSize: '13px', color: '#94a3b8', margin: 0 },

        /* KPI grid */
        kpiGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
        },
        kpiCard: (grad) => ({
            background: grad, borderRadius: '20px',
            padding: '22px', color: 'white',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        }),
        kpiLabel : { fontSize: '12px', color: 'rgba(255,255,255,0.75)', margin: '0 0 6px 0', fontWeight: '600' },
        kpiValue : { fontSize: '36px', fontWeight: '900', color: 'white', lineHeight: 1, margin: 0 },
        kpiIcon  : { fontSize: '30px' },

        /* two-col grid */
        twoCol: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
        },

        /* section card */
        card: {
            background: 'white', borderRadius: '20px',
            border: '1px solid #e2e8f0', padding: '24px',
        },
        cardTitle: { fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '0 0 20px 0' },

        /* bar rows */
        barRow  : { marginBottom: '16px' },
        barMeta : { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
        barLabel: { fontSize: '13px', color: '#475569', fontWeight: '600' },
        barValue: { fontSize: '13px', color: '#0f172a', fontWeight: '800' },
        barBg   : { height: '8px', borderRadius: '100px', background: '#f1f5f9', overflow: 'hidden' },
        barFill : (color, pct) => ({
            height: '100%', borderRadius: '100px',
            width: `${pct}%`, background: color,
            transition: 'width 0.6s ease',
        }),

        /* app rows (with icon) */
        appRow      : { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' },
        appRowIcon  : { fontSize: '22px', width: '28px', textAlign: 'center', flexShrink: 0 },
        appRowInner : { flex: 1 },

        /* bookings by expo */
        expoBarValue: { fontSize: '12px', color: '#6366f1', fontWeight: '700' },

        /* table card */
        tableCard: {
            background: 'white', borderRadius: '20px',
            border: '1px solid #e2e8f0', overflow: 'hidden',
        },
        tableHead: {
            padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        },
        tableTitle: { fontSize: '15px', fontWeight: '800', color: '#0f172a' },
        tableWrap : { overflowX: 'auto' },
        table     : { width: '100%', borderCollapse: 'collapse' },
        th: {
            textAlign: 'left', padding: '11px 20px',
            fontSize: '10px', fontWeight: '700', color: '#94a3b8',
            textTransform: 'uppercase', letterSpacing: '0.06em',
            background: '#f8fafc', borderBottom: '1px solid #f1f5f9',
        },
        td: {
            padding: '14px 20px',
            borderBottom: '1px solid #f8fafc',
            fontSize: '13px', color: '#475569',
            verticalAlign: 'middle',
        },
        tdTitle : { fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px 0' },
        tdTheme : { fontSize: '11px', color: '#6366f1', fontWeight: '600', margin: 0 },
        tdDateSub: { fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' },
        statusPill: (status) => ({
            ...statusStyle(status),
            padding: '3px 10px', borderRadius: '100px',
            fontSize: '10px', fontWeight: '700', textTransform: 'capitalize',
            display: 'inline-block',
        }),
    };

    const kpiCards = [
        { label: 'Total Expos',              value: expos.length,                    icon: '🎪', grad: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
        { label: 'Total Bookings',           value: stats?.totalBookings || 0,        icon: '🎟️', grad: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
        { label: 'Exhibitor Applications',   value: applications.length,             icon: '📋', grad: 'linear-gradient(135deg, #10b981, #059669)' },
        { label: 'Cancelled Bookings',       value: stats?.cancelledBookings || 0,   icon: '❌', grad: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    ];

    const expoBarRows = [
        { label: 'Draft',      value: exposByStatus.draft,      color: '#94a3b8' },
        { label: 'Published',  value: exposByStatus.published,  color: '#6366f1' },
        { label: 'Ongoing',    value: exposByStatus.ongoing,    color: '#10b981' },
        { label: 'Completed',  value: exposByStatus.completed,  color: '#8b5cf6' },
    ];

    const appBarRows = [
        { label: 'Pending Review', value: appsByStatus.pending,  color: '#f59e0b', icon: '⏳' },
        { label: 'Approved',       value: appsByStatus.approved, color: '#10b981', icon: '✅' },
        { label: 'Rejected',       value: appsByStatus.rejected, color: '#ef4444', icon: '❌' },
    ];

    return (
        <div style={s.page}>

            {/* Page header */}
            <div>
                <h2 style={s.pageTitle}>Analytics & Reports</h2>
                <p style={s.pageSub}>Real-time overview of your EventSphere platform</p>
            </div>

            {/* KPI cards */}
            <div style={s.kpiGrid}>
                {kpiCards.map((card, i) => (
                    <div key={i} style={s.kpiCard(card.grad)}>
                        <div>
                            <p style={s.kpiLabel}>{card.label}</p>
                            <p style={s.kpiValue}>{card.value}</p>
                        </div>
                        <span style={s.kpiIcon}>{card.icon}</span>
                    </div>
                ))}
            </div>

            {/* Two-col: expo status + app status */}
            <div style={s.twoCol}>

                {/* Expo status breakdown */}
                <div style={s.card}>
                    <h3 style={s.cardTitle}>Expo Status Breakdown</h3>
                    {expoBarRows.map((item, i) => (
                        <div key={i} style={s.barRow}>
                            <div style={s.barMeta}>
                                <span style={s.barLabel}>{item.label}</span>
                                <span style={s.barValue}>{item.value}</span>
                            </div>
                            <div style={s.barBg}>
                                <div style={s.barFill(
                                    item.color,
                                    expos.length ? (item.value / expos.length) * 100 : 0
                                )} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Exhibitor applications */}
                <div style={s.card}>
                    <h3 style={s.cardTitle}>Exhibitor Applications</h3>
                    {appBarRows.map((item, i) => (
                        <div key={i} style={s.appRow}>
                            <span style={s.appRowIcon}>{item.icon}</span>
                            <div style={s.appRowInner}>
                                <div style={s.barMeta}>
                                    <span style={s.barLabel}>{item.label}</span>
                                    <span style={s.barValue}>{item.value}</span>
                                </div>
                                <div style={s.barBg}>
                                    <div style={s.barFill(
                                        item.color,
                                        applications.length ? (item.value / applications.length) * 100 : 0
                                    )} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bookings by Expo */}
            {stats?.bookingsByExpo?.length > 0 && (
                <div style={s.card}>
                    <h3 style={s.cardTitle}>Bookings by Expo</h3>
                    {stats.bookingsByExpo.map((item, i) => {
                        const max = Math.max(...stats.bookingsByExpo.map(b => b.count));
                        return (
                            <div key={i} style={s.barRow}>
                                <div style={s.barMeta}>
                                    <span style={s.barLabel}>{item.expoTitle}</span>
                                    <span style={s.expoBarValue}>{item.count} bookings</span>
                                </div>
                                <div style={s.barBg}>
                                    <div style={s.barFill(
                                        'linear-gradient(90deg, #6366f1, #8b5cf6)',
                                        (item.count / max) * 100
                                    )} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Expos table */}
            <div style={s.tableCard}>
                <div style={s.tableHead}>
                    <span style={s.tableTitle}>All Expos Overview</span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{expos.length} total</span>
                </div>
                <div style={s.tableWrap}>
                    <table style={s.table}>
                        <thead>
                            <tr>
                                {['Expo', 'Location', 'Dates', 'Status', 'Organizer'].map(h => (
                                    <th key={h} style={s.th}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {expos.map((expo, i) => (
                                <tr
                                    key={expo._id}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                    style={{ background: 'white', transition: 'background 0.15s' }}
                                >
                                    <td style={s.td}>
                                        <p style={s.tdTitle}>{expo.title}</p>
                                        {expo.theme && <p style={s.tdTheme}>{expo.theme}</p>}
                                    </td>
                                    <td style={s.td}>📍 {expo.location}</td>
                                    <td style={s.td}>
                                        <p style={{ margin: 0 }}>{new Date(expo.startDate).toLocaleDateString()}</p>
                                        <p style={s.tdDateSub}>to {new Date(expo.endDate).toLocaleDateString()}</p>
                                    </td>
                                    <td style={s.td}>
                                        <span style={s.statusPill(expo.status)}>{expo.status}</span>
                                    </td>
                                    <td style={s.td}>{expo.organizer?.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;