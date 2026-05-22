import { useState, useEffect } from 'react';
import { getAllFeedback, updateFeedbackStatus } from '../../services/api';
import { toast } from 'react-toastify';

const ManageFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => { fetchFeedback(); }, []);

    const fetchFeedback = async () => {
        try {
            const res = await getAllFeedback();
            setFeedbacks(res.data);
        } catch { toast.error('Failed to load feedback'); }
        finally { setLoading(false); }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateFeedbackStatus(id, status);
            toast.success('Status updated');
            fetchFeedback();
        } catch { toast.error('Failed to update status'); }
    };

    const typeConfig = {
        general:    { icon: '💬', color: '#6366f1' },
        bug:        { icon: '🐛', color: '#ef4444' },
        suggestion: { icon: '💡', color: '#f59e0b' },
        complaint:  { icon: '😤', color: '#f97316' },
        compliment: { icon: '🌟', color: '#10b981' },
    };

    const statusConfig = {
        pending:  { bg: 'rgba(245,158,11,0.1)',  color: '#d97706' },
        reviewed: { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1' },
        resolved: { bg: 'rgba(16,185,129,0.1)',  color: '#059669' },
    };

    const counts = {
        all:      feedbacks.length,
        pending:  feedbacks.filter(f => f.status === 'pending').length,
        reviewed: feedbacks.filter(f => f.status === 'reviewed').length,
        resolved: feedbacks.filter(f => f.status === 'resolved').length,
    };

    const filtered = filter === 'all' ? feedbacks : feedbacks.filter(f => f.status === filter);

    const tabColor = { all: '#6366f1', pending: '#d97706', reviewed: '#6366f1', resolved: '#059669' };

    const s = {
        loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px' },
        title: { fontSize: '22px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px', margin: '0 0 20px 0' },
        tabRow: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
        tab: (t) => ({ padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', border: 'none', transition: 'all 0.15s', textTransform: 'capitalize', background: filter === t ? tabColor[t] : 'white', color: filter === t ? 'white' : '#64748b', boxShadow: filter === t ? `0 4px 12px ${tabColor[t]}40` : '0 1px 4px rgba(0,0,0,0.08)' }),
        list: { display: 'flex', flexDirection: 'column', gap: '14px' },
        card: { background: 'white', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '20px 22px', transition: 'all 0.2s' },
        cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '12px' },
        subject: { fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' },
        meta: { fontSize: '12px', color: '#94a3b8' },
        message: { fontSize: '13px', color: '#64748b', lineHeight: '1.6', margin: '0 0 14px 0' },
        cardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' },
        typePill: (type) => ({ background: `${typeConfig[type]?.color}15`, color: typeConfig[type]?.color, padding: '4px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }),
        statusPill: (status) => ({ background: statusConfig[status]?.bg, color: statusConfig[status]?.color, padding: '4px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: '700' }),
        actionRow: { display: 'flex', gap: '6px' },
        actionBtn: (color) => ({ padding: '5px 12px', background: `${color}15`, border: `1px solid ${color}30`, color, borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s' }),
        empty: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '60px 32px', textAlign: 'center' },
        emptyIcon: { fontSize: '48px', marginBottom: '16px' },
        emptyText: { fontSize: '15px', color: '#94a3b8', fontWeight: '500', margin: 0 },
    };

    if (loading) return (
        <div style={s.loading}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div>
            <h2 style={s.title}>💬 Manage Feedback</h2>

            <div style={s.tabRow}>
                {['all', 'pending', 'reviewed', 'resolved'].map(t => (
                    <button key={t} style={s.tab(t)} onClick={() => setFilter(t)}>
                        {t} ({counts[t]})
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div style={s.empty}>
                    <div style={s.emptyIcon}>💬</div>
                    <p style={s.emptyText}>No {filter === 'all' ? '' : filter} feedback found</p>
                </div>
            ) : (
                <div style={s.list}>
                    {filtered.map(fb => (
                        <div key={fb._id} style={s.card}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#6366f1'; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                        >
                            <div style={s.cardTop}>
                                <div style={{ flex: 1 }}>
                                    <h4 style={s.subject}>{fb.subject}</h4>
                                    <p style={s.meta}>
                                        👤 {fb.user?.name} ({fb.user?.role}) &nbsp;·&nbsp;
                                        📧 {fb.user?.email} &nbsp;·&nbsp;
                                        {fb.expo?.title && `🎪 ${fb.expo.title} · `}
                                        📅 {new Date(fb.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span style={s.statusPill(fb.status)}>{fb.status}</span>
                            </div>

                            <p style={s.message}>{fb.message}</p>

                            <div style={s.cardBottom}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <span style={s.typePill(fb.type)}>
                                        {typeConfig[fb.type]?.icon} {fb.type}
                                    </span>
                                    {fb.rating && (
                                        <span style={{ fontSize: '13px', color: '#f59e0b', fontWeight: '700' }}>
                                            {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                                        </span>
                                    )}
                                </div>

                                <div style={s.actionRow}>
                                    {fb.status !== 'reviewed' && (
                                        <button style={s.actionBtn('#6366f1')}
                                            onClick={() => handleStatusUpdate(fb._id, 'reviewed')}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.2)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                                        >👁️ Mark Reviewed</button>
                                    )}
                                    {fb.status !== 'resolved' && (
                                        <button style={s.actionBtn('#059669')}
                                            onClick={() => handleStatusUpdate(fb._id, 'resolved')}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.2)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(16,185,129,0.1)'}
                                        >✅ Mark Resolved</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageFeedback;