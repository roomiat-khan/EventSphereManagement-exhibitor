import { useState, useEffect } from 'react';
import { getTicketStats, getAllTickets, markTicketUsed, getAllExposAdmin, updateExpo, generateTicketForAllAttendees } from '../../services/api';
import { toast } from 'react-toastify';

const ManageTickets = () => {
    const [stats, setStats]         = useState([]);
    const [tickets, setTickets]     = useState([]);
    const [expos, setExpos]         = useState([]);
    const [selectedExpo, setSelectedExpo] = useState('');
    const [activeTab, setActiveTab] = useState('stats');
    const [loading, setLoading]     = useState(true);
    const [showConfig, setShowConfig] = useState(false);
    const [configExpo, setConfigExpo] = useState(null);
    const [showGenerate, setShowGenerate] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [generateData, setGenerateData] = useState({
        expoId: '',
        ticketType: 'general'
    });
    const [configData, setConfigData] = useState({
        ticketsEnabled: false,
        totalTickets: 100,
        ticketPrices: { general: 0, vip: 0, student: 0 }
    });

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        try {
            const [statsRes, exposRes] = await Promise.all([
                getTicketStats(),
                getAllExposAdmin(),
            ]);
            setStats(statsRes.data);
            setExpos(exposRes.data);
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to load data');
        }
        finally { setLoading(false); }
    };

    const fetchTickets = async (expoId) => {
        try {
            const res = await getAllTickets({ expoId });
            setTickets(res.data);
        } catch { toast.error('Failed to load tickets'); }
    };

    const handleExpoChange = (e) => {
        setSelectedExpo(e.target.value);
        if (e.target.value) fetchTickets(e.target.value);
        else setTickets([]);
    };

    const openConfig = (expo) => {
        setConfigExpo(expo);
        setConfigData({
            ticketsEnabled: expo.expo.ticketsEnabled ?? false,
            totalTickets: expo.expo.totalTickets ?? 100,
            ticketPrices: {
                general: expo.expo.ticketPrices?.general ?? 0,
                vip:     expo.expo.ticketPrices?.vip     ?? 0,
                student: expo.expo.ticketPrices?.student ?? 0,
            }
        });
        setShowConfig(true);
    };

    const handleSaveConfig = async () => {
        try {
            await updateExpo(configExpo.expo._id, {
                ticketsEnabled: configData.ticketsEnabled,
                totalTickets:   configData.totalTickets,
                ticketPrices:   configData.ticketPrices,
            });
            toast.success('Ticket settings saved!');
            setShowConfig(false);
            fetchAll();
        } catch { toast.error('Failed to save settings'); }
    };

    const handleMarkUsed = async (id) => {
        try {
            await markTicketUsed(id);
            toast.success('Ticket marked as used');
            if (selectedExpo) fetchTickets(selectedExpo);
        } catch { toast.error('Failed to update ticket'); }
    };

    const handleGenerateTicket = async () => {
        if (!generateData.expoId) {
            toast.error('Please select an expo');
            return;
        }
        
        setGenerating(true);
        try {
            const response = await generateTicketForAllAttendees({
                expoId: generateData.expoId,
                ticketType: generateData.ticketType
            });
            toast.success(response.data.message || '🎟️ Tickets generated successfully for all attendees!');
            setShowGenerate(false);
            setGenerateData({ expoId: '', ticketType: 'general' });
            if (selectedExpo) fetchTickets(selectedExpo);
            fetchAll();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate tickets');
        } finally { setGenerating(false); }
    };

    const statusStyle = (status) => ({
        active:    { bg: 'rgba(16,185,129,0.1)',  color: '#059669', border: 'rgba(16,185,129,0.3)'  },
        used:      { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1', border: 'rgba(99,102,241,0.3)'  },
        cancelled: { bg: 'rgba(239,68,68,0.1)',   color: '#dc2626', border: 'rgba(239,68,68,0.3)'   },
    }[status] || { bg: 'rgba(148,163,184,0.1)', color: '#64748b', border: '#e2e8f0' });

    const typeStyle = (type) => ({
        general: { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1' },
        vip:     { bg: 'rgba(245,158,11,0.1)',  color: '#d97706' },
        student: { bg: 'rgba(16,185,129,0.1)',  color: '#059669' },
    }[type] || { bg: 'rgba(148,163,184,0.1)', color: '#64748b' });

    const s = {
        loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px' },
        title: { fontSize: '22px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px', margin: '0 0 20px 0' },
        headerActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
        generateBtn: { padding: '10px 22px', background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)', transition: 'all 0.2s' },
        tabRow: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
        tab: (active) => ({ padding: '9px 20px', borderRadius: '10px', border: 'none', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s', background: active ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'white', color: active ? 'white' : '#64748b', boxShadow: active ? '0 4px 12px rgba(99,102,241,0.3)' : '0 1px 4px rgba(0,0,0,0.06)', border: active ? 'none' : '1px solid #e2e8f0' }),
        statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '16px' },
        statCard: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'all 0.2s' },
        statCardHead: { padding: '18px 20px', background: 'linear-gradient(135deg,#0f172a,#1e1b4b)', position: 'relative', overflow: 'hidden' },
        statCardBg: { position: 'absolute', inset: 0, backgroundImage: `radial-gradient(ellipse at 80% 50%, rgba(99,102,241,0.2) 0%, transparent 60%)` },
        statCardHeadContent: { position: 'relative', zIndex: 1 },
        statExpoTitle: { fontSize: '15px', fontWeight: '800', color: 'white', margin: '0 0 4px 0' },
        statExpoMeta: { fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 },
        statCardBody: { padding: '16px 20px' },
        statRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '14px' },
        statItem: { textAlign: 'center', padding: '10px 6px', borderRadius: '10px' },
        statNum: { fontSize: '20px', fontWeight: '900', lineHeight: '1' },
        statLabel: { fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '3px' },
        capBar: { marginBottom: '14px' },
        capLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' },
        capTrack: { height: '6px', background: '#f1f5f9', borderRadius: '100px', overflow: 'hidden' },
        configBtn: { width: '100%', padding: '9px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#6366f1', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s' },
        controls: { background: 'white', borderRadius: '16px', padding: '16px 20px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' },
        select: { padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', color: '#0f172a', background: '#f8fafc', outline: 'none', cursor: 'pointer', minWidth: '220px' },
        tableCard: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' },
        tableHead: { display: 'grid', gridTemplateColumns: '1.5fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
        th: { padding: '12px 16px', fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' },
        tableRow: { display: 'grid', gridTemplateColumns: '1.5fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr', borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' },
        td: { padding: '12px 16px', display: 'flex', alignItems: 'center', fontSize: '13px', color: '#0f172a' },
        statusPill: (status) => ({ background: statusStyle(status).bg, color: statusStyle(status).color, border: `1px solid ${statusStyle(status).border}`, padding: '3px 8px', borderRadius: '100px', fontSize: '10px', fontWeight: '700', textTransform: 'capitalize' }),
        typePill: (type) => ({ background: typeStyle(type).bg, color: typeStyle(type).color, padding: '3px 8px', borderRadius: '100px', fontSize: '10px', fontWeight: '700', textTransform: 'capitalize' }),
        useBtn: { padding: '5px 12px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#6366f1', borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s' },
        overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px', backdropFilter: 'blur(4px)' },
        modal: { background: 'white', borderRadius: '24px', width: '100%', maxWidth: '480px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', overflow: 'hidden' },
        modalHead: { padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        modalTitle: { fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: 0 },
        closeBtn: { width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        modalBody: { padding: '24px' },
        label: { display: 'block', fontSize: '11px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' },
        input: { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#0f172a', outline: 'none', background: '#f8fafc', boxSizing: 'border-box', marginBottom: '14px', fontFamily: 'inherit', transition: 'all 0.2s' },
        priceGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px' },
        saveBtn: { width: '100%', padding: '12px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' },
        empty: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '60px 32px', textAlign: 'center' },
        emptyIcon: { fontSize: '48px', marginBottom: '12px' },
        emptyText: { fontSize: '14px', color: '#94a3b8', margin: 0 },
        toggleWrap: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' },
        toggle: (on) => ({ width: '44px', height: '24px', borderRadius: '100px', background: on ? '#6366f1' : '#e2e8f0', border: 'none', cursor: 'pointer', position: 'relative', transition: 'all 0.2s', flexShrink: 0 }),
        toggleDot: (on) => ({ position: 'absolute', top: '3px', left: on ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }),
        selectFull: { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', color: '#0f172a', background: '#f8fafc', outline: 'none', cursor: 'pointer', marginBottom: '16px', fontFamily: 'inherit' },
        typeGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '20px' },
        typeBtn: (active, type) => {
            const colors = { general: '#6366f1', vip: '#d97706', student: '#059669' };
            return {
                padding: '12px 8px',
                borderRadius: '12px',
                border: active ? `2px solid ${colors[type]}` : '1px solid #e2e8f0',
                background: active ? `rgba(${type === 'general' ? '99,102,241' : type === 'vip' ? '245,158,11' : '16,185,129'},0.1)` : '#f8fafc',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s'
            };
        },
        typeBtnIcon: { fontSize: '20px', display: 'block', marginBottom: '4px' },
        typeBtnLabel: (active, type) => {
            const colors = { general: '#6366f1', vip: '#d97706', student: '#059669' };
            return {
                fontSize: '11px',
                fontWeight: '700',
                color: active ? colors[type] : '#64748b',
                display: 'block'
            };
        },
        confirmBtn: { width: '100%', padding: '13px', background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' },
    };

    const focusInput = (e) => { e.target.style.border = '1.5px solid #6366f1'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; };
    const blurInput  = (e) => { e.target.style.border = '1.5px solid #e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; };

    if (loading) return (
        <div style={s.loading}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div>
            <div style={s.headerActions}>
                <h2 style={s.title}>🎟️ Manage Tickets</h2>
                <button style={s.generateBtn}
                    onClick={() => setShowGenerate(true)}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(16,185,129,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,185,129,0.3)'; }}
                >
                    ➕ Generate Tickets (All Attendees)
                </button>
            </div>

            {/* Tabs */}
            <div style={s.tabRow}>
                <button style={s.tab(activeTab === 'stats')}   onClick={() => setActiveTab('stats')}>📊 Ticket Stats</button>
                <button style={s.tab(activeTab === 'tickets')} onClick={() => setActiveTab('tickets')}>🎟️ All Tickets</button>
            </div>

            {/* Generate Ticket Modal */}
            {showGenerate && (
                <div style={s.overlay}>
                    <div style={s.modal}>
                        <div style={s.modalHead}>
                            <h3 style={s.modalTitle}>🎟️ Generate Tickets for All Attendees</h3>
                            <button style={s.closeBtn} onClick={() => { setShowGenerate(false); setGenerateData({ expoId: '', ticketType: 'general' }); }}>
                                ✕
                            </button>
                        </div>
                        <div style={s.modalBody}>
                            {/* Select Expo */}
                            <label style={s.label}>Select Expo</label>
                            <select 
                                value={generateData.expoId} 
                                onChange={e => setGenerateData(p => ({ ...p, expoId: e.target.value }))}
                                style={s.selectFull}
                                onFocus={focusInput} onBlur={blurInput}
                            >
                                <option value="">-- Select Expo --</option>
                                {expos.map(expo => (
                                    <option key={expo._id} value={expo._id}>
                                        {expo.title} ({expo.location}) {!expo.ticketsEnabled && '🔴 Tickets Disabled'}
                                    </option>
                                ))}
                            </select>

                            {/* Ticket Type */}
                            <label style={s.label}>Select Ticket Type (for ALL attendees)</label>
                            <div style={s.typeGrid}>
                                {[
                                    { type: 'general', icon: '🎟️', label: 'General' },
                                    { type: 'vip', icon: '⭐', label: 'VIP' },
                                    { type: 'student', icon: '🎓', label: 'Student' },
                                ].map(({ type, icon, label }) => (
                                    <div key={type}
                                        style={s.typeBtn(generateData.ticketType === type, type)}
                                        onClick={() => setGenerateData(p => ({ ...p, ticketType: type }))}
                                    >
                                        <span style={s.typeBtnIcon}>{icon}</span>
                                        <span style={s.typeBtnLabel(generateData.ticketType === type, type)}>{label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Warning */}
                            {generateData.expoId && (
                                <div style={{ background: '#fff3cd', border: '1px solid #ffecb5', borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
                                    <span style={{ fontSize: '13px', color: '#856404' }}>
                                        ⚠️ This will generate a <strong>{generateData.ticketType}</strong> ticket for <strong>ALL attendees</strong> in the system!
                                    </span>
                                </div>
                            )}

                            <button style={{ ...s.confirmBtn, opacity: generating ? 0.7 : 1 }}
                                onClick={handleGenerateTicket} disabled={generating}
                            >
                                {generating ? '⏳ Generating Tickets...' : '🎟️ Generate Tickets for All Attendees'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* STATS TAB */}
            {activeTab === 'stats' && (
                stats.length === 0 ? (
                    <div style={s.empty}>
                        <div style={s.emptyIcon}>🎟️</div>
                        <p style={s.emptyText}>No expos with tickets enabled yet. Configure ticket settings on your expos.</p>
                    </div>
                ) : (
                    <>
                        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '16px 20px', marginBottom: '20px' }}>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>⚙️ Configure Tickets for Expos</div>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {expos.map(expo => (
                                    <button key={expo._id}
                                        onClick={() => openConfig({ expo })}
                                        style={{ padding: '8px 16px', background: expo.ticketsEnabled ? 'rgba(16,185,129,0.1)' : '#f8fafc', border: `1px solid ${expo.ticketsEnabled ? 'rgba(16,185,129,0.3)' : '#e2e8f0'}`, color: expo.ticketsEnabled ? '#059669' : '#64748b', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s' }}
                                    >
                                        {expo.ticketsEnabled ? '✅' : '⚙️'} {expo.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={s.statsGrid}>
                            {stats.map((item, i) => {
                                const pct = item.soldPercent;
                                const barColor = pct >= 90 ? '#ef4444' : pct >= 60 ? '#f59e0b' : '#10b981';
                                return (
                                    <div key={i} style={s.statCard}>
                                        <div style={s.statCardHead}>
                                            <div style={s.statCardBg} />
                                            <div style={s.statCardHeadContent}>
                                                <h3 style={s.statExpoTitle}>{item.expo.title}</h3>
                                                <p style={s.statExpoMeta}>📍 {item.expo.location} · 📅 {new Date(item.expo.startDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div style={s.statCardBody}>
                                            <div style={s.statRow}>
                                                {[
                                                    { label: 'Total', val: item.expo.totalTickets, bg: 'rgba(99,102,241,0.08)', color: '#6366f1' },
                                                    { label: 'Sold', val: item.expo.ticketsSold, bg: 'rgba(245,158,11,0.08)', color: '#d97706' },
                                                    { label: 'Active', val: item.active, bg: 'rgba(16,185,129,0.08)', color: '#059669' },
                                                    { label: 'Remaining', val: item.remaining, bg: 'rgba(6,182,212,0.08)', color: '#0891b2' },
                                                ].map((s2, j) => (
                                                    <div key={j} style={{ ...s.statItem, background: s2.bg }}>
                                                        <div style={{ ...s.statNum, color: s2.color }}>{s2.val}</div>
                                                        <div style={{ ...s.statLabel, color: s2.color }}>{s2.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={s.capBar}>
                                                <div style={s.capLabel}>
                                                    <span>Sold</span>
                                                    <span style={{ fontWeight: '700', color: barColor }}>{pct}%</span>
                                                </div>
                                                <div style={s.capTrack}>
                                                    <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: '100px' }} />
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                <span style={{ fontSize: '12px', color: '#64748b' }}>💰 Revenue</span>
                                                <span style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>PKR {item.revenue.toLocaleString()}</span>
                                            </div>
                                            <button style={s.configBtn} onClick={() => openConfig(item)}>⚙️ Configure Tickets</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )
            )}

            {/* TICKETS TAB */}
            {activeTab === 'tickets' && (
                <>
                    <div style={s.controls}>
                        <select value={selectedExpo} onChange={handleExpoChange} style={s.select}>
                            <option value="">Select Expo to view tickets</option>
                            {expos.map(expo => (
                                <option key={expo._id} value={expo._id}>{expo.title}</option>
                            ))}
                        </select>
                        {selectedExpo && (
                            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                                {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} found
                            </span>
                        )}
                    </div>

                    {!selectedExpo ? (
                        <div style={s.empty}>
                            <div style={s.emptyIcon}>🎟️</div>
                            <p style={s.emptyText}>Select an expo to view its tickets</p>
                        </div>
                    ) : tickets.length === 0 ? (
                        <div style={s.empty}>
                            <div style={s.emptyIcon}>📭</div>
                            <p style={s.emptyText}>No tickets booked for this expo yet</p>
                        </div>
                    ) : (
                        <div style={s.tableCard}>
                            <div style={s.tableHead}>
                                {['Ticket #', 'Attendee', 'Type', 'Price', 'Status', 'Action'].map((h, i) => (
                                    <div key={i} style={s.th}>{h}</div>
                                ))}
                            </div>
                            {tickets.map(ticket => (
                                <div key={ticket._id} style={s.tableRow}>
                                    <div style={s.td}>
                                        <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: '700', color: '#6366f1' }}>
                                            {ticket.ticketNumber}
                                        </span>
                                    </div>
                                    <div style={s.td}>
                                        <div>
                                            <div style={{ fontWeight: '700', fontSize: '13px' }}>{ticket.attendee?.name}</div>
                                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{ticket.attendee?.email}</div>
                                        </div>
                                    </div>
                                    <div style={s.td}>
                                        <span style={s.typePill(ticket.ticketType)}>{ticket.ticketType}</span>
                                    </div>
                                    <div style={s.td}>
                                        <span>{ticket.price > 0 ? `PKR ${ticket.price}` : 'Free'}</span>
                                    </div>
                                    <div style={s.td}>
                                        <span style={s.statusPill(ticket.status)}>{ticket.status}</span>
                                    </div>
                                    <div style={s.td}>
                                        {ticket.status === 'active' && (
                                            <button style={s.useBtn} onClick={() => handleMarkUsed(ticket._id)}>✅ Mark Used</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Config Modal */}
            {showConfig && configExpo && (
                <div style={s.overlay}>
                    <div style={s.modal}>
                        <div style={s.modalHead}>
                            <h3 style={s.modalTitle}>⚙️ Ticket Settings</h3>
                            <button style={s.closeBtn} onClick={() => setShowConfig(false)}>✕</button>
                        </div>
                        <div style={s.modalBody}>
                            <p style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>🎪 {configExpo.expo.title}</p>
                            <div style={s.toggleWrap}>
                                <button style={s.toggle(configData.ticketsEnabled)} onClick={() => setConfigData(p => ({ ...p, ticketsEnabled: !p.ticketsEnabled }))}>
                                    <div style={s.toggleDot(configData.ticketsEnabled)} />
                                </button>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                                        {configData.ticketsEnabled ? '✅ Tickets Enabled' : '❌ Tickets Disabled'}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Attendees can book tickets when enabled</div>
                                </div>
                            </div>
                            <label style={s.label}>Total Tickets Available</label>
                            <input type="number" value={configData.totalTickets} min="1" onChange={e => setConfigData(p => ({ ...p, totalTickets: parseInt(e.target.value) || 0 }))} style={s.input} />
                            <label style={s.label}>Ticket Prices (PKR) — 0 = Free</label>
                            <div style={s.priceGrid}>
                                {['general', 'vip', 'student'].map(type => (
                                    <div key={type}>
                                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '4px', textTransform: 'capitalize' }}>{type}</div>
                                        <input type="number" min="0" value={configData.ticketPrices[type]} onChange={e => setConfigData(p => ({ ...p, ticketPrices: { ...p.ticketPrices, [type]: parseInt(e.target.value) || 0 } }))} style={s.input} />
                                    </div>
                                ))}
                            </div>
                            <button style={s.saveBtn} onClick={handleSaveConfig}>💾 Save Settings</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageTickets;