import { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking } from '../../services/api';
import { toast } from 'react-toastify';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = async () => {
        try {
            const res = await getMyBookings();
            setBookings(res.data);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this booking?')) return;
        setCancellingId(id);
        try {
            await cancelBooking(id);
            toast.success('Booking cancelled');
            fetchBookings();
        } catch (error) {
            toast.error('Failed to cancel booking');
        } finally {
            setCancellingId(null);
        }
    };

    const statusStyle = (status) => {
        const map = {
            confirmed : { background: 'rgba(16,185,129,0.1)',  border: '1px solid rgba(16,185,129,0.3)',  color: '#059669' },
            cancelled : { background: 'rgba(239,68,68,0.1)',   border: '1px solid rgba(239,68,68,0.3)',   color: '#dc2626' },
            attended  : { background: 'rgba(99,102,241,0.1)',  border: '1px solid rgba(99,102,241,0.3)',  color: '#6366f1' },
        };
        return map[status] || { background: 'rgba(148,163,184,0.1)', border: '1px solid #e2e8f0', color: '#64748b' };
    };

    const s = {
        loading: {
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '60px', fontSize: '14px', color: '#94a3b8', fontWeight: '500',
        },

        /* page header */
        pageTitle: {
            fontSize: '22px', fontWeight: '900', color: '#0f172a',
            letterSpacing: '-0.5px', margin: '0 0 24px 0',
        },

        /* empty state */
        empty: {
            background: 'white', borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '64px 32px', textAlign: 'center',
        },
        emptyIcon : { fontSize: '52px', marginBottom: '16px' },
        emptyTitle: { fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' },
        emptyDesc : { fontSize: '13px', color: '#94a3b8', margin: 0 },

        /* list */
        list: { display: 'flex', flexDirection: 'column', gap: '16px' },

        /* booking card */
        card: {
            background: 'white', borderRadius: '20px',
            border: '1px solid #e2e8f0', padding: '22px 24px',
            transition: 'all 0.2s',
        },
        cardInner: {
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', gap: '16px',
        },

        /* left info */
        titleRow: {
            display: 'flex', alignItems: 'center',
            gap: '10px', marginBottom: '12px', flexWrap: 'wrap',
        },
        sessionTitle: {
            fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0,
        },
        statusBadge: (status) => ({
            ...statusStyle(status),
            padding: '3px 10px', borderRadius: '100px',
            fontSize: '10px', fontWeight: '700',
            textTransform: 'capitalize', whiteSpace: 'nowrap',
        }),

        /* meta rows */
        meta: { fontSize: '13px', color: '#64748b', margin: '0 0 5px 0' },
        metaStrong: { fontWeight: '700', color: '#0f172a' },
        bookedAt: { fontSize: '11px', color: '#94a3b8', margin: '10px 0 0 0' },

        /* divider between meta rows — just spacing */
        metaGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4px 24px',
        },

        /* cancel button */
        cancelBtn: (loading) => ({
            padding: '9px 18px',
            background: loading ? 'rgba(239,68,68,0.05)' : 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            color: '#ef4444', borderRadius: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '12px', fontWeight: '700',
            whiteSpace: 'nowrap', flexShrink: 0,
            transition: 'all 0.2s',
            opacity: loading ? 0.6 : 1,
        }),
    };

    if (loading) return <div style={s.loading}>⏳ Loading bookings...</div>;

    return (
        <div>
            <h2 style={s.pageTitle}>My Bookings</h2>

            {bookings.length === 0 ? (
                /* Empty state */
                <div style={s.empty}>
                    <div style={s.emptyIcon}>🎟️</div>
                    <p style={s.emptyTitle}>No bookings yet</p>
                    <p style={s.emptyDesc}>Browse sessions and book your spot!</p>
                </div>
            ) : (
                /* Booking list */
                <div style={s.list}>
                    {bookings.map(booking => (
                        <div
                            key={booking._id}
                            style={s.card}
                            onMouseEnter={e => {
                                e.currentTarget.style.boxShadow   = '0 8px 32px rgba(0,0,0,0.08)';
                                e.currentTarget.style.borderColor = '#6366f1';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.boxShadow   = 'none';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                            }}
                        >
                            <div style={s.cardInner}>

                                {/* Left: info */}
                                <div style={{ flex: 1 }}>
                                    {/* Title + status */}
                                    <div style={s.titleRow}>
                                        <h3 style={s.sessionTitle}>{booking.session?.title}</h3>
                                        <span style={s.statusBadge(booking.status)}>{booking.status}</span>
                                    </div>

                                    {/* Meta grid */}
                                    <div style={s.metaGrid}>
                                        <p style={s.meta}>
                                            🎪 Expo:&nbsp;
                                            <span style={s.metaStrong}>{booking.expo?.title}</span>
                                        </p>
                                        <p style={s.meta}>
                                            🎤 Speaker:&nbsp;
                                            <span style={s.metaStrong}>{booking.session?.speaker?.name}</span>
                                        </p>
                                        <p style={s.meta}>
                                            📍 {booking.session?.location}
                                        </p>
                                        <p style={s.meta}>
                                            🕐&nbsp;
                                            {booking.session?.startTime
                                                ? new Date(booking.session.startTime).toLocaleString()
                                                : 'TBD'}
                                        </p>
                                    </div>

                                    <p style={s.bookedAt}>
                                        Booked on: {new Date(booking.bookedAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Right: cancel button */}
                                {booking.status === 'confirmed' && (
                                    <button
                                        onClick={() => handleCancel(booking._id)}
                                        disabled={cancellingId === booking._id}
                                        style={s.cancelBtn(cancellingId === booking._id)}
                                        onMouseEnter={e => {
                                            if (cancellingId !== booking._id) {
                                                e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
                                                e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background  = 'rgba(239,68,68,0.08)';
                                            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)';
                                        }}
                                    >
                                        {cancellingId === booking._id ? '⏳ Cancelling...' : 'Cancel'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;