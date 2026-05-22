import { useState, useEffect } from 'react';
import { getMyBookmarks, removeBookmark, bookSession } from '../../services/api';
import { toast } from 'react-toastify';

const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);
    const [bookingId, setBookingId] = useState(null);

    useEffect(() => { fetchBookmarks(); }, []);

    const fetchBookmarks = async () => {
        try {
            const res = await getMyBookmarks();
            setBookmarks(res.data);
        } catch { toast.error('Failed to load bookmarks'); }
        finally { setLoading(false); }
    };

    const handleRemove = async (sessionId) => {
        setRemovingId(sessionId);
        try {
            await removeBookmark(sessionId);
            toast.success('Bookmark removed');
            setBookmarks(prev => prev.filter(b => b.session._id !== sessionId));
        } catch { toast.error('Failed to remove bookmark'); }
        finally { setRemovingId(null); }
    };

    const handleBook = async (bookmark) => {
        setBookingId(bookmark.session._id);
        try {
            await bookSession({ sessionId: bookmark.session._id, expoId: bookmark.expo._id });
            toast.success('Session booked successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to book session');
        } finally { setBookingId(null); }
    };

    const typeStyle = (type) => ({
        talk:       { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1' },
        workshop:   { bg: 'rgba(16,185,129,0.1)',  color: '#059669' },
        panel:      { bg: 'rgba(139,92,246,0.1)',  color: '#7c3aed' },
        keynote:    { bg: 'rgba(245,158,11,0.1)',  color: '#d97706' },
        networking: { bg: 'rgba(236,72,153,0.1)',  color: '#db2777' },
    }[type] || { bg: 'rgba(148,163,184,0.1)', color: '#64748b' });

    const s = {
        page: { fontFamily: "'Segoe UI',system-ui,sans-serif" },
        header: { marginBottom: '24px' },
        title: { fontSize: '22px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px', margin: '0 0 4px 0' },
        subtitle: { fontSize: '13px', color: '#94a3b8', margin: 0 },
        list: { display: 'flex', flexDirection: 'column', gap: '14px' },
        card: { background: 'white', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '20px 22px', transition: 'all 0.2s' },
        cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' },
        cardLeft: { flex: 1, minWidth: 0 },
        titleRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' },
        sessionTitle: { fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 },
        typePill: (type) => ({ background: typeStyle(type).bg, color: typeStyle(type).color, padding: '3px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: '700', textTransform: 'capitalize', whiteSpace: 'nowrap' }),
        metaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '4px 16px', marginBottom: '10px' },
        metaItem: { fontSize: '12px', color: '#64748b', margin: 0 },
        topic: { fontSize: '12px', color: '#6366f1', fontWeight: '600', margin: '6px 0 0 0' },
        tagRow: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' },
        tag: { background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '100px' },
        capBar: { marginTop: '10px' },
        capLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' },
        capTrack: { height: '4px', background: '#f1f5f9', borderRadius: '100px', overflow: 'hidden' },
        expoTag: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#6366f1', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', marginTop: '10px' },
        actionCol: { display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 },
        bookBtn: (disabled) => ({ padding: '8px 16px', background: disabled ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '12px', fontWeight: '700', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', boxShadow: disabled ? 'none' : '0 4px 12px rgba(99,102,241,0.3)' }),
        removeBtn: { padding: '8px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' },
        empty: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '64px 32px', textAlign: 'center' },
        emptyIcon: { fontSize: '52px', marginBottom: '16px' },
        emptyTitle: { fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' },
        emptyText: { fontSize: '13px', color: '#94a3b8', margin: 0 },
        loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px' },
    };

    if (loading) return (
        <div style={s.loading}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Loading bookmarks...</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div style={s.page}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 640px) {
                    .bm-card-top { flex-direction: column !important; }
                    .bm-action-col { flex-direction: row !important; }
                    .bm-meta-grid { grid-template-columns: 1fr 1fr !important; }
                }
            `}</style>

            {/* Header */}
            <div style={s.header}>
                <h2 style={s.title}>🔖 Bookmarked Sessions</h2>
                <p style={s.subtitle}>Sessions you've saved for later — book them before they fill up!</p>
            </div>

            {bookmarks.length === 0 ? (
                <div style={s.empty}>
                    <div style={s.emptyIcon}>🔖</div>
                    <h3 style={s.emptyTitle}>No bookmarks yet</h3>
                    <p style={s.emptyText}>Browse sessions and bookmark the ones you're interested in</p>
                </div>
            ) : (
                <>
                    <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px', fontWeight: '500' }}>
                        {bookmarks.length} bookmarked session{bookmarks.length !== 1 ? 's' : ''}
                    </div>
                    <div style={s.list}>
                        {bookmarks.map((bookmark, i) => {
                            const session = bookmark.session;
                            const pct = Math.round((session.registeredCount / session.capacity) * 100);
                            const barColor = pct >= 90 ? '#ef4444' : pct >= 60 ? '#f59e0b' : '#10b981';
                            const isFull = session.registeredCount >= session.capacity;

                            return (
                                <div key={bookmark._id} style={s.card}
                                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#6366f1'; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                >
                                    <div style={s.cardTop} className="bm-card-top">
                                        <div style={s.cardLeft}>
                                            {/* Title + type */}
                                            <div style={s.titleRow}>
                                                <h3 style={s.sessionTitle}>{session.title}</h3>
                                                <span style={s.typePill(session.type)}>{session.type}</span>
                                            </div>

                                            {/* Meta */}
                                            <div style={s.metaGrid} className="bm-meta-grid">
                                                <p style={s.metaItem}>🎤 {session.speaker?.name}</p>
                                                <p style={s.metaItem}>📍 {session.location || 'TBD'}</p>
                                                <p style={s.metaItem}>🕐 {session.startTime ? new Date(session.startTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'TBD'}</p>
                                                <p style={s.metaItem}>⏱️ ends {session.endTime ? new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}</p>
                                            </div>

                                            {session.topic && <p style={s.topic}>💡 {session.topic}</p>}

                                            {session.tags?.length > 0 && (
                                                <div style={s.tagRow}>
                                                    {session.tags.map((tag, j) => (
                                                        <span key={j} style={s.tag}>#{tag}</span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Capacity bar */}
                                            <div style={s.capBar}>
                                                <div style={s.capLabel}>
                                                    <span>Capacity</span>
                                                    <span style={{ fontWeight: '700', color: barColor }}>{session.registeredCount}/{session.capacity} ({pct}%)</span>
                                                </div>
                                                <div style={s.capTrack}>
                                                    <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: '100px', transition: 'width 0.5s' }} />
                                                </div>
                                            </div>

                                            {/* Expo tag */}
                                            <div style={s.expoTag}>
                                                🎪 {bookmark.expo?.title}
                                                {bookmark.expo?.location && ` · 📍 ${bookmark.expo.location}`}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div style={s.actionCol} className="bm-action-col">
                                            {isFull ? (
                                                <span style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: '10px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                                                    🔴 Full
                                                </span>
                                            ) : (
                                                <button
                                                    style={s.bookBtn(bookingId === session._id)}
                                                    disabled={bookingId === session._id}
                                                    onClick={() => handleBook(bookmark)}
                                                    onMouseEnter={e => { if (bookingId !== session._id) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(99,102,241,0.4)'; } }}
                                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.3)'; }}
                                                >
                                                    {bookingId === session._id ? '⏳ Booking...' : '🎟️ Book Now'}
                                                </button>
                                            )}
                                            <button
                                                style={s.removeBtn}
                                                disabled={removingId === session._id}
                                                onClick={() => handleRemove(session._id)}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor = '#ef4444'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
                                            >
                                                {removingId === session._id ? '⏳' : '🗑️ Remove'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default Bookmarks;