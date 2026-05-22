import { useState, useEffect } from 'react';
import { getAllApplications, approveExhibitor, rejectExhibitor } from '../../services/api';
import { toast } from 'react-toastify';

const ManageExhibitors = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedApp, setSelectedApp] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [processingId, setProcessingId] = useState(null);
    const [reasonFocused, setReasonFocused] = useState(false);

    useEffect(() => { fetchApplications(); }, []);

    const fetchApplications = async () => {
        try {
            const res = await getAllApplications();
            setApplications(res.data);
        } catch (error) {
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        setProcessingId(id);
        try {
            await approveExhibitor(id);
            toast.success('Application approved');
            fetchApplications();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async () => {
        if (!selectedApp) return;
        setProcessingId(selectedApp._id);
        try {
            await rejectExhibitor(selectedApp._id, rejectReason);
            toast.success('Application rejected');
            setShowRejectModal(false);
            setRejectReason('');
            setSelectedApp(null);
            fetchApplications();
        } catch (error) {
            toast.error('Failed to reject application');
        } finally {
            setProcessingId(null);
        }
    };

    const closeRejectModal = () => {
        setShowRejectModal(false);
        setSelectedApp(null);
        setRejectReason('');
    };

    const filtered = filter === 'all'
        ? applications
        : applications.filter(a => a.applicationStatus === filter);

    const statusStyle = (status) => {
        const map = {
            pending  : { background: 'rgba(245,158,11,0.1)',  border: '1px solid rgba(245,158,11,0.3)',  color: '#d97706' },
            approved : { background: 'rgba(16,185,129,0.1)',  border: '1px solid rgba(16,185,129,0.3)',  color: '#059669' },
            rejected : { background: 'rgba(239,68,68,0.1)',   border: '1px solid rgba(239,68,68,0.3)',   color: '#dc2626' },
        };
        return map[status] || { background: 'rgba(148,163,184,0.1)', border: '1px solid #e2e8f0', color: '#64748b' };
    };

    const counts = {
        all      : applications.length,
        pending  : applications.filter(a => a.applicationStatus === 'pending').length,
        approved : applications.filter(a => a.applicationStatus === 'approved').length,
        rejected : applications.filter(a => a.applicationStatus === 'rejected').length,
    };

    const tabColor = {
        all      : '#6366f1',
        pending  : '#d97706',
        approved : '#059669',
        rejected : '#dc2626',
    };

    /* ── styles ─────────────────────────────────────────────── */
    const s = {
        loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', fontSize: '14px', color: '#94a3b8', fontWeight: '500' },

        pageTitle: { fontSize: '22px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px', margin: '0 0 20px 0' },

        /* filter tabs */
        tabRow: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
        tab: (t) => ({
            padding: '8px 16px', borderRadius: '10px',
            fontSize: '12px', fontWeight: '700', cursor: 'pointer',
            border: 'none', transition: 'all 0.15s', textTransform: 'capitalize',
            background: filter === t
                ? tabColor[t]
                : 'white',
            color: filter === t ? 'white' : '#64748b',
            boxShadow: filter === t
                ? `0 4px 12px ${tabColor[t]}40`
                : '0 1px 4px rgba(0,0,0,0.08)',
        }),

        /* empty */
        empty: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '64px 32px', textAlign: 'center' },
        emptyIcon : { fontSize: '52px', marginBottom: '16px' },
        emptyText : { fontSize: '15px', color: '#94a3b8', fontWeight: '500', margin: 0 },

        /* app list */
        list: { display: 'flex', flexDirection: 'column', gap: '16px' },

        /* app card */
        card: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '22px 24px', transition: 'all 0.2s' },
        cardInner: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' },
        cardLeft : { flex: 1, minWidth: 0 },

        titleRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' },
        companyName: { fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 },
        statusPill: (status) => ({
            ...statusStyle(status),
            padding: '3px 10px', borderRadius: '100px',
            fontSize: '10px', fontWeight: '700', textTransform: 'capitalize', whiteSpace: 'nowrap',
        }),

        /* meta grid */
        metaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: '4px 16px', marginBottom: '12px' },
        metaItem: { fontSize: '13px', color: '#64748b', margin: 0 },

        desc: { fontSize: '13px', color: '#64748b', margin: '0 0 12px 0', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },

        tagRow: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' },
        tag   : { background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '100px' },

        boothInfo    : { fontSize: '13px', color: '#059669', fontWeight: '600', margin: '0 0 2px 0' },
        rejectReason : { fontSize: '13px', color: '#ef4444', margin: '4px 0 0 0' },
        appliedAt    : { fontSize: '11px', color: '#94a3b8', margin: '8px 0 0 0' },

        /* action buttons */
        actionCol  : { display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 },
        approveBtn : (disabled) => ({
            padding: '8px 16px',
            background: disabled ? 'rgba(16,185,129,0.4)' : 'linear-gradient(135deg,#10b981,#059669)',
            border: 'none', borderRadius: '10px',
            color: 'white', fontSize: '12px', fontWeight: '700',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s', whiteSpace: 'nowrap',
            boxShadow: disabled ? 'none' : '0 4px 12px rgba(16,185,129,0.3)',
        }),
        rejectBtn: {
            padding: '8px 16px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            color: '#ef4444', borderRadius: '10px',
            fontSize: '12px', fontWeight: '700',
            cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
        },

        /* reject modal */
        overlay: {
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 50, padding: '16px',
            backdropFilter: 'blur(4px)',
        },
        modal: {
            background: 'white', borderRadius: '20px',
            width: '100%', maxWidth: '440px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.2)', overflow: 'hidden',
        },
        modalHead: {
            padding: '20px 24px', borderBottom: '1px solid #f1f5f9',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        },
        modalTitle : { fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 },
        modalSub   : { fontSize: '13px', color: '#64748b', margin: '16px 0 10px 0' },
        closeBtn   : { width: '30px', height: '30px', borderRadius: '8px', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', cursor: 'pointer', color: '#64748b', transition: 'background 0.15s' },
        modalBody  : { padding: '20px 24px' },
        reasonInput: {
            width: '100%', padding: '10px 14px',
            border: reasonFocused ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
            borderRadius: '10px', fontSize: '14px', fontWeight: '500',
            color: '#0f172a', background: 'white', outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: reasonFocused ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none',
            boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit',
            marginBottom: '16px',
        },
        modalBtnRow: { display: 'flex', gap: '10px' },
        confirmBtn : (disabled) => ({
            flex: 1, padding: '10px',
            background: disabled ? 'rgba(239,68,68,0.4)' : 'linear-gradient(135deg,#ef4444,#dc2626)',
            border: 'none', borderRadius: '10px',
            color: 'white', fontSize: '13px', fontWeight: '700',
            cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
        }),
        cancelBtn: {
            flex: 1, padding: '10px', background: '#f1f5f9',
            border: 'none', borderRadius: '10px',
            color: '#475569', fontSize: '13px', fontWeight: '700',
            cursor: 'pointer', transition: 'background 0.15s',
        },
    };

    if (loading) return <div style={s.loading}>⏳ Loading applications...</div>;

    return (
        <div>
            <h2 style={s.pageTitle}>Manage Exhibitors</h2>

            {/* ── Filter tabs ── */}
            <div style={s.tabRow}>
                {['all', 'pending', 'approved', 'rejected'].map(t => (
                    <button
                        key={t} style={s.tab(t)}
                        onClick={() => setFilter(t)}
                    >
                        {t} ({counts[t]})
                    </button>
                ))}
            </div>

            {/* ── Reject modal ── */}
            {showRejectModal && (
                <div style={s.overlay}>
                    <div style={s.modal}>
                        <div style={s.modalHead}>
                            <p style={s.modalTitle}>❌ Reject Application</p>
                            <button style={s.closeBtn} onClick={closeRejectModal}
                                onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                                onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                            >✕</button>
                        </div>
                        <div style={s.modalBody}>
                            <p style={s.modalSub}>
                                Rejecting <strong style={{ color: '#0f172a' }}>{selectedApp?.companyName}</strong>. Provide a reason (optional):
                            </p>
                            <textarea
                                rows={3}
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                                placeholder="Reason for rejection..."
                                onFocus={() => setReasonFocused(true)}
                                onBlur={() => setReasonFocused(false)}
                                style={s.reasonInput}
                            />
                            <div style={s.modalBtnRow}>
                                <button
                                    onClick={handleReject}
                                    disabled={!!processingId}
                                    style={s.confirmBtn(!!processingId)}
                                >
                                    {processingId ? '⏳ Rejecting...' : 'Confirm Reject'}
                                </button>
                                <button style={s.cancelBtn} onClick={closeRejectModal}
                                    onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                                >Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Empty state ── */}
            {filtered.length === 0 ? (
                <div style={s.empty}>
                    <div style={s.emptyIcon}>👥</div>
                    <p style={s.emptyText}>No {filter === 'all' ? '' : filter} applications found.</p>
                </div>
            ) : (
                /* ── Application cards ── */
                <div style={s.list}>
                    {filtered.map(app => (
                        <div
                            key={app._id}
                            style={s.card}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#6366f1'; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                        >
                            <div style={s.cardInner}>
                                {/* Left */}
                                <div style={s.cardLeft}>
                                    {/* Title + status */}
                                    <div style={s.titleRow}>
                                        <h3 style={s.companyName}>{app.companyName}</h3>
                                        <span style={s.statusPill(app.applicationStatus)}>{app.applicationStatus}</span>
                                    </div>

                                    {/* Meta */}
                                    <div style={s.metaGrid}>
                                        <p style={s.metaItem}>👤 {app.user?.name}</p>
                                        <p style={s.metaItem}>📧 {app.user?.email}</p>
                                        <p style={s.metaItem}>🎪 {app.expo?.title}</p>
                                        <p style={{ ...s.metaItem, textTransform: 'capitalize' }}>🏷️ {app.category}</p>
                                    </div>

                                    {/* Description */}
                                    {app.description && <p style={s.desc}>{app.description}</p>}

                                    {/* Product tags */}
                                    {app.products?.length > 0 && (
                                        <div style={s.tagRow}>
                                            {app.products.map((p, i) => <span key={i} style={s.tag}>{p}</span>)}
                                        </div>
                                    )}

                                    {/* Booth info */}
                                    {app.booth && (
                                        <p style={s.boothInfo}>🏢 Booth: <strong>{app.booth.boothNumber}</strong></p>
                                    )}

                                    {/* Rejection reason */}
                                    {app.rejectionReason && (
                                        <p style={s.rejectReason}>❌ Reason: {app.rejectionReason}</p>
                                    )}

                                    <p style={s.appliedAt}>Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                                </div>

                                {/* Right — action buttons */}
                                {app.applicationStatus === 'pending' && (
                                    <div style={s.actionCol}>
                                        <button
                                            style={s.approveBtn(processingId === app._id)}
                                            disabled={processingId === app._id}
                                            onClick={() => handleApprove(app._id)}
                                            onMouseEnter={e => { if (!processingId) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(16,185,129,0.4)'; } }}
                                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,185,129,0.3)'; }}
                                        >
                                            ✅ Approve
                                        </button>
                                        <button
                                            style={s.rejectBtn}
                                            onClick={() => { setSelectedApp(app); setShowRejectModal(true); }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)'; }}
                                        >
                                            ❌ Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageExhibitors;