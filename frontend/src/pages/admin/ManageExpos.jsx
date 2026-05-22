import { useState, useEffect } from 'react';
import { getAllExposAdmin, createExpo, updateExpo, deleteExpo } from '../../services/api';
import { toast } from 'react-toastify';

const CITIES = [
    'Karachi', 'Lahore', 'Islamabad', 'Multan', 'Quetta',
    'Hyderabad', 'Faisalabad', 'Rawalpindi', 'Gujranwala', 'Peshawar'
];
const today = new Date().toISOString().split('T')[0];

const ManageExpos = () => {
    const [expos, setExpos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingExpo, setEditingExpo] = useState(null);

    // ── Delete confirmation state ──
    const [deleteModal, setDeleteModal] = useState({ open: false, expoId: null, expoTitle: '' });
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({
        title: '', description: '', location: '',
        startDate: '', endDate: '', theme: '',
        status: 'draft', maxBooths: 50,
        registrationDeadline: '',
        // Ticket Settings
        ticketsEnabled: false,
        totalTickets: 100,
        ticketPrices: { general: 0, vip: 0, student: 0 }
    });

    useEffect(() => { fetchExpos(); }, []);

    const fetchExpos = async () => {
        try {
            const res = await getAllExposAdmin();
            setExpos(res.data);
        } catch (error) {
            toast.error('Failed to load expos');
        } finally {
            setLoading(false);
        }
    };

    const getNextDay = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
    };

    const handleStartDateChange = (val) => {
        setFormData(prev => ({
            ...prev,
            startDate: val,
            endDate: prev.endDate && prev.endDate <= val ? '' : prev.endDate,
            registrationDeadline: prev.registrationDeadline && prev.registrationDeadline < val ? '' : prev.registrationDeadline,
        }));
    };

    const handleEndDateChange = (val) => {
        setFormData(prev => ({
            ...prev,
            endDate: val,
            registrationDeadline: prev.registrationDeadline && prev.registrationDeadline > val ? '' : prev.registrationDeadline,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingExpo) {
                await updateExpo(editingExpo._id, formData);
                toast.success('Expo updated successfully');
            } else {
                await createExpo(formData);
                toast.success('Expo created successfully');
            }
            resetForm();
            fetchExpos();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save expo');
        }
    };

    const handleEdit = (expo) => {
        setEditingExpo(expo);
        setFormData({
            title: expo.title,
            description: expo.description,
            location: expo.location,
            startDate: expo.startDate?.split('T')[0],
            endDate: expo.endDate?.split('T')[0],
            theme: expo.theme || '',
            status: expo.status,
            maxBooths: expo.maxBooths,
            registrationDeadline: expo.registrationDeadline?.split('T')[0] || '',
            // Ticket Settings
            ticketsEnabled: expo.ticketsEnabled || false,
            totalTickets: expo.totalTickets || 100,
            ticketPrices: expo.ticketPrices || { general: 0, vip: 0, student: 0 }
        });
        setShowForm(true);
    };

    const handleDeleteClick = (expo) => {
        setDeleteModal({ open: true, expoId: expo._id, expoTitle: expo.title });
    };

    const handleDeleteConfirm = async () => {
        setDeleting(true);
        try {
            await deleteExpo(deleteModal.expoId);
            toast.success('Expo deleted');
            fetchExpos();
        } catch (error) {
            toast.error('Failed to delete expo');
        } finally {
            setDeleting(false);
            setDeleteModal({ open: false, expoId: null, expoTitle: '' });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ open: false, expoId: null, expoTitle: '' });
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingExpo(null);
        setFormData({
            title: '', description: '', location: '',
            startDate: '', endDate: '', theme: '',
            status: 'draft', maxBooths: 50,
            registrationDeadline: '',
            ticketsEnabled: false,
            totalTickets: 100,
            ticketPrices: { general: 0, vip: 0, student: 0 }
        });
    };

    const daysLeft = (deadline) => {
        if (!deadline) return null;
        return Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    };

    const statusStyle = (status) => ({
        draft:     { background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.3)', color: '#64748b' },
        published: { background: 'rgba(99,102,241,0.1)',  border: '1px solid rgba(99,102,241,0.3)',  color: '#6366f1' },
        ongoing:   { background: 'rgba(16,185,129,0.1)',  border: '1px solid rgba(16,185,129,0.3)',  color: '#059669' },
        completed: { background: 'rgba(139,92,246,0.1)',  border: '1px solid rgba(139,92,246,0.3)',  color: '#7c3aed' },
        cancelled: { background: 'rgba(239,68,68,0.1)',   border: '1px solid rgba(239,68,68,0.3)',   color: '#dc2626' },
    }[status] || { background: 'rgba(148,163,184,0.1)', border: '1px solid #e2e8f0', color: '#64748b' });

    const s = {
        loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', fontSize: '14px', color: '#94a3b8', fontWeight: '500' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
        pageTitle: { fontSize: '22px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px', margin: 0 },
        createBtn: { padding: '10px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', gap: '6px' },
        empty: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '64px 32px', textAlign: 'center' },
        emptyIcon: { fontSize: '52px', marginBottom: '16px' },
        emptyText: { fontSize: '15px', color: '#94a3b8', fontWeight: '500', margin: '0 0 20px 0' },
        tableCard: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' },
        tableHead: { display: 'grid', gridTemplateColumns: '2fr 1fr 1.4fr 0.8fr 1fr 0.9fr', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
        th: { padding: '14px 16px', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' },
        tableBody: { display: 'flex', flexDirection: 'column' },
        tableRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1.4fr 0.8fr 1fr 0.9fr', borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' },
        td: { padding: '14px 16px', display: 'flex', alignItems: 'center' },
        expoTitle: { fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px 0' },
        expoTheme: { fontSize: '12px', color: '#6366f1', margin: 0, fontWeight: '500' },
        location: { fontSize: '13px', color: '#475569', fontWeight: '500' },
        dateText: { fontSize: '12px', color: '#64748b', lineHeight: '1.6' },
        statusPill: (status) => ({ ...statusStyle(status), padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '700', textTransform: 'capitalize', whiteSpace: 'nowrap', display: 'inline-block' }),
        actionRow: { display: 'flex', gap: '6px' },
        editBtn: { padding: '6px 12px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#6366f1', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s' },
        deleteBtn: { padding: '6px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s' },
        overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px', backdropFilter: 'blur(4px)' },
        modal: { background: 'white', borderRadius: '24px', width: '100%', maxWidth: '700px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' },
        modalHead: { padding: '22px 28px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 1 },
        modalTitle: { fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 },
        closeBtn: { width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', cursor: 'pointer', color: '#64748b', transition: 'background 0.15s' },
        modalBody: { padding: '24px 28px' },
        label: { display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' },
        input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#0f172a', outline: 'none', transition: 'all 0.2s', background: '#f8fafc', boxSizing: 'border-box', marginBottom: '16px', fontFamily: 'inherit' },
        inputDisabled: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#94a3b8', outline: 'none', background: '#f1f5f9', boxSizing: 'border-box', marginBottom: '16px', fontFamily: 'inherit', cursor: 'not-allowed' },
        textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#0f172a', outline: 'none', transition: 'all 0.2s', background: '#f8fafc', boxSizing: 'border-box', marginBottom: '16px', fontFamily: 'inherit', resize: 'vertical' },
        select: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#0f172a', outline: 'none', background: '#f8fafc', boxSizing: 'border-box', marginBottom: '16px', cursor: 'pointer' },
        grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
        modalBtnRow: { display: 'flex', gap: '10px', marginTop: '8px' },
        submitBtn: { flex: 1, padding: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' },
        cancelBtn: { flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '10px', color: '#475569', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'background 0.15s' },
        hint: { fontSize: '11px', color: '#94a3b8', marginTop: '-12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' },
        deadlineBadge: (days) => ({
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '3px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: '700',
            background: days <= 3 ? 'rgba(239,68,68,0.1)' : days <= 7 ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
            color: days <= 3 ? '#dc2626' : days <= 7 ? '#d97706' : '#059669',
            border: `1px solid ${days <= 3 ? 'rgba(239,68,68,0.3)' : days <= 7 ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`,
        }),
        // Ticket Settings Styles
        ticketSection: { marginTop: '24px', padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' },
        ticketSectionTitle: { fontSize: '14px', fontWeight: '800', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
        toggleRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' },
        toggle: (on) => ({ width: '48px', height: '26px', borderRadius: '100px', background: on ? '#6366f1' : '#cbd5e1', border: 'none', cursor: 'pointer', position: 'relative', transition: 'all 0.2s', flexShrink: 0 }),
        toggleDot: (on) => ({ position: 'absolute', top: '3px', left: on ? '25px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }),
        priceGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginTop: '12px' },
        priceBox: { textAlign: 'center' },
        priceLabel: { fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '6px', textTransform: 'capitalize' },
        priceInput: { width: '100%', padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', textAlign: 'center', background: 'white' },
    };

    const focusInput = (e) => { e.target.style.border = '1.5px solid #6366f1'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; };
    const blurInput  = (e) => { e.target.style.border = '1.5px solid #e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; };

    if (loading) return <div style={s.loading}>⏳ Loading expos...</div>;

    return (
        <div>
            <style>{`
                @media (max-width: 768px) {
                    .expo-table-head, .expo-table-row { grid-template-columns: 1fr 1fr !important; }
                    .expo-table-col-hide { display: none !important; }
                    .expo-modal-grid2 { grid-template-columns: 1fr !important; }
                    .price-grid-3 { grid-template-columns: 1fr !important; }
                }
                .del-modal-enter {
                    animation: delModalIn 0.2s ease;
                }
                @keyframes delModalIn {
                    from { opacity: 0; transform: scale(0.92) translateY(10px); }
                    to   { opacity: 1; transform: scale(1)    translateY(0);    }
                }
                .del-confirm-btn:hover:not(:disabled) {
                    background: #dc2626 !important;
                    box-shadow: 0 8px 24px rgba(239,68,68,0.4) !important;
                    transform: translateY(-1px);
                }
                .del-cancel-btn:hover {
                    background: #e2e8f0 !important;
                }
            `}</style>

            {/* DELETE CONFIRMATION MODAL */}
            {deleteModal.open && (
                <div style={s.overlay} onClick={handleDeleteCancel}>
                    <div className="del-modal-enter" style={{
                        background: 'white', borderRadius: '24px', width: '100%', maxWidth: '420px',
                        padding: '36px 32px', boxShadow: '0 24px 64px rgba(0,0,0,0.25)', textAlign: 'center',
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{
                            width: '72px', height: '72px', background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.25)', borderRadius: '20px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '32px', margin: '0 auto 20px',
                        }}>🗑️</div>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.3px' }}>
                            Delete Expo?
                        </h3>
                        <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', margin: '0 0 8px 0' }}>
                            Are you sure you want to delete
                        </p>
                        <p style={{
                            fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0',
                            background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px',
                            padding: '8px 16px', display: 'inline-block',
                        }}>
                            🎪 {deleteModal.expoTitle}
                        </p>
                        <p style={{ fontSize: '13px', color: '#ef4444', margin: '12px 0 28px 0', fontWeight: '500' }}>
                            ⚠️ This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="del-cancel-btn" onClick={handleDeleteCancel} style={{
                                flex: 1, padding: '12px', background: '#f1f5f9', border: 'none',
                                borderRadius: '12px', color: '#475569', fontSize: '14px', fontWeight: '700',
                                cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                            }}>Cancel</button>
                            <button className="del-confirm-btn" onClick={handleDeleteConfirm} disabled={deleting} style={{
                                flex: 1, padding: '12px', background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: '700',
                                cursor: deleting ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                                boxShadow: '0 4px 12px rgba(239,68,68,0.3)', opacity: deleting ? 0.7 : 1, fontFamily: 'inherit',
                            }}>{deleting ? '⏳ Deleting...' : '🗑️ Yes, Delete'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div style={s.header}>
                <h2 style={s.pageTitle}>Manage Expos</h2>
                <button style={s.createBtn} onClick={() => setShowForm(true)}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(99,102,241,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.3)'; }}
                >＋ Create Expo</button>
            </div>

            {/* Create/Edit Modal */}
            {showForm && (
                <div style={s.overlay}>
                    <div style={s.modal}>
                        <div style={s.modalHead}>
                            <h3 style={s.modalTitle}>{editingExpo ? '✏️ Edit Expo' : '🎪 Create New Expo'}</h3>
                            <button style={s.closeBtn} onClick={resetForm}
                                onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                                onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                            >✕</button>
                        </div>
                        <div style={s.modalBody}>
                            <form onSubmit={handleSubmit}>
                                <label style={s.label}>Title</label>
                                <input type="text" value={formData.title} required
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Expo title" style={s.input}
                                    onFocus={focusInput} onBlur={blurInput}
                                />
                                <label style={s.label}>Description</label>
                                <textarea value={formData.description} required rows={3}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Expo description" style={s.textarea}
                                    onFocus={focusInput} onBlur={blurInput}
                                />
                                <div style={s.grid2} className="expo-modal-grid2">
                                    <div>
                                        <label style={s.label}>📍 City</label>
                                        <select value={formData.location} required
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            style={s.select} onFocus={focusInput} onBlur={blurInput}
                                        >
                                            <option value="">Select City...</option>
                                            {CITIES.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={s.label}>Theme</label>
                                        <input type="text" value={formData.theme}
                                            onChange={e => setFormData({ ...formData, theme: e.target.value })}
                                            placeholder="e.g. Technology 2026"
                                            style={s.input} onFocus={focusInput} onBlur={blurInput}
                                        />
                                    </div>
                                </div>
                                <div style={s.grid2} className="expo-modal-grid2">
                                    <div>
                                        <label style={s.label}>📅 Start Date</label>
                                        <input type="date" value={formData.startDate} required
                                            min={today}
                                            onChange={e => handleStartDateChange(e.target.value)}
                                            style={s.input} onFocus={focusInput} onBlur={blurInput}
                                        />
                                    </div>
                                    <div>
                                        <label style={s.label}>📅 End Date</label>
                                        {!formData.startDate ? (
                                            <div style={s.inputDisabled}>Select start date first</div>
                                        ) : (
                                            <input type="date" value={formData.endDate} required
                                                min={getNextDay(formData.startDate)}
                                                onChange={e => handleEndDateChange(e.target.value)}
                                                style={s.input} onFocus={focusInput} onBlur={blurInput}
                                            />
                                        )}
                                    </div>
                                </div>
                                <label style={s.label}>⏰ Registration Deadline</label>
                                {!formData.startDate || !formData.endDate ? (
                                    <div style={s.inputDisabled}>Select start & end date first</div>
                                ) : (
                                    <input type="date" value={formData.registrationDeadline}
                                        min={formData.startDate} max={formData.endDate}
                                        onChange={e => setFormData({ ...formData, registrationDeadline: e.target.value })}
                                        style={s.input} onFocus={focusInput} onBlur={blurInput}
                                    />
                                )}
                                <div style={s.hint}>
                                    ℹ️ Deadline must be between start and end date. Attendees & exhibitors get email reminders as deadline approaches.
                                </div>
                                <div style={s.grid2} className="expo-modal-grid2">
                                    <div>
                                        <label style={s.label}>Status</label>
                                        <select value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                                            style={s.select}
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                            <option value="ongoing">Ongoing</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={s.label}>Max Booths</label>
                                        <input type="number" value={formData.maxBooths}
                                            onChange={e => setFormData({ ...formData, maxBooths: e.target.value })}
                                            style={s.input} onFocus={focusInput} onBlur={blurInput}
                                        />
                                    </div>
                                </div>

                                {/* ========== TICKET SETTINGS SECTION ========== */}
                                <div style={s.ticketSection}>
                                    <div style={s.ticketSectionTitle}>
                                        <span>🎟️</span> Ticket Settings
                                    </div>
                                    
                                    {/* Toggle Enable/Disable Tickets */}
                                    <div style={s.toggleRow}>
                                        <button type="button" style={s.toggle(formData.ticketsEnabled)}
                                            onClick={() => setFormData(prev => ({ ...prev, ticketsEnabled: !prev.ticketsEnabled }))}
                                        >
                                            <div style={s.toggleDot(formData.ticketsEnabled)} />
                                        </button>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                                                {formData.ticketsEnabled ? '✅ Tickets Enabled' : '❌ Tickets Disabled'}
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                                                {formData.ticketsEnabled ? 'Attendees can book/generate tickets' : 'Disable to stop ticket sales'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Tickets */}
                                    <label style={s.label}>Total Tickets Available</label>
                                    <input type="number" value={formData.totalTickets} min="1"
                                        onChange={e => setFormData(prev => ({ ...prev, totalTickets: parseInt(e.target.value) || 0 }))}
                                        style={s.input} onFocus={focusInput} onBlur={blurInput}
                                        disabled={!formData.ticketsEnabled}
                                    />

                                    {/* Ticket Prices */}
                                    <label style={s.label}>Ticket Prices (PKR) — 0 = Free</label>
                                    <div style={s.priceGrid} className="price-grid-3">
                                        {['general', 'vip', 'student'].map(type => (
                                            <div key={type} style={s.priceBox}>
                                                <div style={s.priceLabel}>{type === 'general' ? '🎟️ General' : type === 'vip' ? '⭐ VIP' : '🎓 Student'}</div>
                                                <input type="number" min="0"
                                                    value={formData.ticketPrices[type]}
                                                    onChange={e => setFormData(prev => ({
                                                        ...prev,
                                                        ticketPrices: { ...prev.ticketPrices, [type]: parseInt(e.target.value) || 0 }
                                                    }))}
                                                    style={s.priceInput}
                                                    onFocus={focusInput} onBlur={blurInput}
                                                    disabled={!formData.ticketsEnabled}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* ========== END TICKET SETTINGS ========== */}

                                <div style={s.modalBtnRow}>
                                    <button type="submit" style={s.submitBtn}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(99,102,241,0.4)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.3)'; }}
                                    >
                                        {editingExpo ? 'Update Expo' : 'Create Expo'}
                                    </button>
                                    <button type="button" style={s.cancelBtn} onClick={resetForm}
                                        onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                                    >Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {expos.length === 0 ? (
                <div style={s.empty}>
                    <div style={s.emptyIcon}>🎪</div>
                    <p style={s.emptyText}>No expos yet. Create your first expo!</p>
                    <button style={s.createBtn} onClick={() => setShowForm(true)}>＋ Create First Expo</button>
                </div>
            ) : (
                <div style={s.tableCard}>
                    <div style={s.tableHead} className="expo-table-head">
                        {['Expo', 'City', 'Dates', 'Status', 'Deadline', 'Actions'].map((h, i) => (
                            <div key={i} style={s.th}>{h}</div>
                        ))}
                    </div>
                    <div style={s.tableBody}>
                        {expos.map(expo => {
                            const days = daysLeft(expo.registrationDeadline);
                            return (
                                <div key={expo._id} style={s.tableRow} className="expo-table-row"
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                >
                                    <div style={s.td}>
                                        <div>
                                            <p style={s.expoTitle}>
                                                {expo.title}
                                                {expo.ticketsEnabled && <span style={{ marginLeft: '8px', fontSize: '10px', color: '#059669', background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: '20px' }}>🎟️ Tickets Enabled</span>}
                                            </p>
                                            {expo.theme && <p style={s.expoTheme}>🎯 {expo.theme}</p>}
                                        </div>
                                    </div>
                                    <div style={s.td}>
                                        <span style={s.location}>📍 {expo.location}</span>
                                    </div>
                                    <div style={s.td}>
                                        <div style={s.dateText}>
                                            <div>📅 {new Date(expo.startDate).toLocaleDateString()}</div>
                                            <div style={{ color: '#94a3b8' }}>→ {new Date(expo.endDate).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div style={s.td}>
                                        <span style={s.statusPill(expo.status)}>{expo.status}</span>
                                    </div>
                                    <div style={s.td}>
                                        {expo.registrationDeadline && days !== null ? (
                                            <div>
                                                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                                                    {new Date(expo.registrationDeadline).toLocaleDateString()}
                                                </div>
                                                {days >= 0 ? (
                                                    <span style={s.deadlineBadge(days)}>
                                                        {days === 0 ? '🔴 Today!' : `⏳ ${days}d left`}
                                                    </span>
                                                ) : (
                                                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>✅ Ended</span>
                                                )}
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '12px', color: '#cbd5e1' }}>—</span>
                                        )}
                                    </div>
                                    <div style={s.td}>
                                        <div style={s.actionRow}>
                                            <button style={s.editBtn} onClick={() => handleEdit(expo)}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.borderColor = '#6366f1'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; }}
                                            >✏️ Edit</button>
                                            <button style={s.deleteBtn} onClick={() => handleDeleteClick(expo)}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor = '#ef4444'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
                                            >🗑️</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageExpos;