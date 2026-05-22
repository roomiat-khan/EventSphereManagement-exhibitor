import { useState, useEffect, useRef, useContext } from 'react';
import { getMyBookings } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const EventPass = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const passRef = useRef(null);

    useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = async () => {
        try {
            const res = await getMyBookings();
            setBookings(res.data);
            if (res.data.length > 0) setSelectedBooking(res.data[0]);
        } catch { toast.error('Failed to load bookings'); }
        finally { setLoading(false); }
    };

    const generateQRCode = (booking) => {
        const data = `EVENTSPHERE-PASS-${booking._id}-${user._id}`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}&bgcolor=ffffff&color=0f172a&margin=10`;
    };

    const handlePrint = () => {
        const printContent = passRef.current.innerHTML;
        const w = window.open('', '_blank');
        w.document.write(`
            <html><head><title>EventSphere Pass</title>
            <style>
                body { margin: 0; padding: 20px; font-family: 'Segoe UI', sans-serif; background: #f1f5f9; }
                * { box-sizing: border-box; }
            </style></head>
            <body>${printContent}</body></html>
        `);
        w.document.close();
        w.print();
    };

    const s = {
        page: { fontFamily: "'Segoe UI',system-ui,sans-serif" },
        header: { marginBottom: '24px' },
        title: { fontSize: '22px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px', margin: '0 0 4px 0' },
        subtitle: { fontSize: '13px', color: '#94a3b8', margin: 0 },
        layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
        leftPanel: {},
        sectionTitle: { fontSize: '13px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' },
        bookingList: { display: 'flex', flexDirection: 'column', gap: '10px' },
        bookingItem: (active) => ({ padding: '14px 16px', borderRadius: '14px', border: active ? '2px solid #6366f1' : '1px solid #e2e8f0', background: active ? 'rgba(99,102,241,0.05)' : 'white', cursor: 'pointer', transition: 'all 0.2s' }),
        bookingName: { fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: '0 0 3px 0' },
        bookingMeta: { fontSize: '11px', color: '#94a3b8', margin: 0 },

        // Pass Card
        passWrap: { position: 'sticky', top: '24px' },
        passCard: {
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
            borderRadius: '24px', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            position: 'relative',
        },
        passBg: {
            position: 'absolute', inset: 0,
            backgroundImage: `radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.2) 0%, transparent 50%)`,
        },
        passContent: { position: 'relative', zIndex: 1 },
        passHeader: { padding: '24px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
        passLogoRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
        passLogoBox: { width: '36px', height: '36px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', color: 'white' },
        passLogoText: { fontSize: '16px', fontWeight: '800', color: 'white' },
        passLogoSpan: { color: '#818cf8' },
        passBadge: { display: 'inline-block', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', color: '#6ee7b7', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '100px', letterSpacing: '0.08em' },
        passTitle: { fontSize: '22px', fontWeight: '900', color: 'white', margin: '10px 0 4px 0', letterSpacing: '-0.5px' },
        passExpo: { fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: 0 },
        passBody: { padding: '20px 28px' },
        passInfoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' },
        passInfoItem: {},
        passInfoLabel: { fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' },
        passInfoVal: { fontSize: '13px', fontWeight: '700', color: 'white' },
        passFooter: { padding: '20px 28px', borderTop: '1px dashed rgba(255,255,255,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        qrWrap: { background: 'white', borderRadius: '12px', padding: '8px', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
        passId: { fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', wordBreak: 'break-all', maxWidth: '180px' },
        printBtn: { padding: '12px 24px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer', marginTop: '16px', width: '100%', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' },
        empty: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '60px 32px', textAlign: 'center' },
        emptyIcon: { fontSize: '52px', marginBottom: '16px' },
        emptyText: { fontSize: '15px', color: '#94a3b8', fontWeight: '500', margin: 0 },
        loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px' },
    };

    if (loading) return (
        <div style={s.loading}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div style={s.page}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    .ep-layout { grid-template-columns: 1fr !important; }
                    .ep-pass-info { grid-template-columns: 1fr 1fr !important; }
                }
            `}</style>

            <div style={s.header}>
                <h2 style={s.title}>🎫 Digital Event Pass</h2>
                <p style={s.subtitle}>Your digital pass for booked sessions — print or show on screen</p>
            </div>

            {bookings.length === 0 ? (
                <div style={s.empty}>
                    <div style={s.emptyIcon}>🎫</div>
                    <p style={s.emptyText}>No bookings yet. Book a session to get your pass!</p>
                </div>
            ) : (
                <div style={s.layout} className="ep-layout">

                    {/* Left — Booking List */}
                    <div style={s.leftPanel}>
                        <p style={s.sectionTitle}>Select a Booking</p>
                        <div style={s.bookingList}>
                            {bookings.map(booking => (
                                <div key={booking._id}
                                    style={s.bookingItem(selectedBooking?._id === booking._id)}
                                    onClick={() => setSelectedBooking(booking)}
                                    onMouseEnter={e => { if (selectedBooking?._id !== booking._id) e.currentTarget.style.borderColor = '#6366f1'; }}
                                    onMouseLeave={e => { if (selectedBooking?._id !== booking._id) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                >
                                    <p style={s.bookingName}>{booking.session?.title}</p>
                                    <p style={s.bookingMeta}>
                                        🎪 {booking.expo?.title} &nbsp;·&nbsp;
                                        🕐 {booking.session?.startTime ? new Date(booking.session.startTime).toLocaleDateString() : 'TBD'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Pass Card */}
                    {selectedBooking && (
                        <div style={s.passWrap}>
                            <p style={s.sectionTitle}>Your Event Pass</p>
                            <div ref={passRef}>
                                <div style={s.passCard}>
                                    <div style={s.passBg} />
                                    <div style={s.passContent}>

                                        {/* Pass Header */}
                                        <div style={s.passHeader}>
                                            <div style={s.passLogoRow}>
                                                <div style={s.passLogoBox}>ES</div>
                                                <span style={s.passLogoText}>Event<span style={s.passLogoSpan}>Sphere</span></span>
                                            </div>
                                            <span style={s.passBadge}>✅ CONFIRMED PASS</span>
                                            <h2 style={s.passTitle}>{selectedBooking.session?.title}</h2>
                                            <p style={s.passExpo}>🎪 {selectedBooking.expo?.title}</p>
                                        </div>

                                        {/* Pass Body */}
                                        <div style={s.passBody}>
                                            <div style={s.passInfoGrid} className="ep-pass-info">
                                                {[
                                                    { label: 'Attendee',  val: user?.name },
                                                    { label: 'Email',     val: user?.email },
                                                    { label: 'Speaker',   val: selectedBooking.session?.speaker?.name || 'TBD' },
                                                    { label: 'Location',  val: selectedBooking.session?.location || 'TBD' },
                                                    { label: 'Date',      val: selectedBooking.session?.startTime ? new Date(selectedBooking.session.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD' },
                                                    { label: 'Time',      val: selectedBooking.session?.startTime ? new Date(selectedBooking.session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD' },
                                                ].map((info, i) => (
                                                    <div key={i} style={s.passInfoItem}>
                                                        <div style={s.passInfoLabel}>{info.label}</div>
                                                        <div style={s.passInfoVal}>{info.val}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Pass Footer with QR */}
                                        <div style={s.passFooter}>
                                            <div>
                                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Scan to Verify</div>
                                                <div style={s.qrWrap}>
                                                    <img src={generateQRCode(selectedBooking)} alt="QR Code" style={{ width: '84px', height: '84px' }} />
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pass ID</div>
                                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>
                                                    {selectedBooking._id?.slice(-12).toUpperCase()}
                                                </div>
                                                <div style={{ marginTop: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                                                    Booked: {new Date(selectedBooking.bookedAt || selectedBooking.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button style={s.printBtn} onClick={handlePrint}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.4)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.3)'; }}
                            >
                                🖨️ Print / Save Pass
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EventPass;