import { useState, useEffect } from 'react';
import { getAllExposAdmin, getBoothsByExpo, createBooth, updateBooth, deleteBooth } from '../../services/api';
import { toast } from 'react-toastify';

const ManageBooths = () => {
    const [expos, setExpos] = useState([]);
    const [booths, setBooths] = useState([]);
    const [selectedExpo, setSelectedExpo] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showBulkForm, setShowBulkForm] = useState(false);
    const [editingBooth, setEditingBooth] = useState(null);
    const [focusedField, setFocusedField] = useState(null);
    const [selectFocused, setSelectFocused] = useState(false);
    const [formData, setFormData] = useState({ boothNumber: '', size: 'medium', price: 0, description: '' });
    const [bulkData, setBulkData] = useState({ rows: 3, columns: 5, price: 100, size: 'medium' });

    useEffect(() => { fetchExpos(); }, []);

    const fetchExpos = async () => {
        try {
            const res = await getAllExposAdmin();
            setExpos(res.data);
        } catch { toast.error('Failed to load expos'); }
    };

    const fetchBooths = async (expoId) => {
        setLoading(true);
        try {
            const res = await getBoothsByExpo(expoId);
            setBooths(res.data);
        } catch { toast.error('Failed to load booths'); }
        finally { setLoading(false); }
    };

    const handleExpoChange = (e) => {
        setSelectedExpo(e.target.value);
        if (e.target.value) fetchBooths(e.target.value);
        else setBooths([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, expo: selectedExpo };
            if (editingBooth) { await updateBooth(editingBooth._id, payload); toast.success('Booth updated'); }
            else { await createBooth(payload); toast.success('Booth created'); }
            resetForm();
            fetchBooths(selectedExpo);
        } catch (error) { toast.error(error.response?.data?.message || 'Failed to save booth'); }
    };

    const handleBulkCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/booths/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({ ...bulkData, expoId: selectedExpo }),
            });
            const data = await res.json();
            toast.success(data.message);
            setShowBulkForm(false);
            fetchBooths(selectedExpo);
        } catch { toast.error('Failed to create booths'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this booth?')) return;
        try {
            await deleteBooth(id);
            toast.success('Booth deleted');
            fetchBooths(selectedExpo);
        } catch { toast.error('Failed to delete booth'); }
    };

    const handleEdit = (booth) => {
        setEditingBooth(booth);
        setFormData({ boothNumber: booth.boothNumber, size: booth.size, price: booth.price, description: booth.description || '' });
        setShowForm(true);
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingBooth(null);
        setFormData({ boothNumber: '', size: 'medium', price: 0, description: '' });
    };

    const boothTheme = (status) => ({
        available : { border: '2px solid rgba(16,185,129,0.4)',  bg: 'rgba(16,185,129,0.06)',  hBg: 'rgba(16,185,129,0.12)', color: '#059669' },
        reserved  : { border: '2px solid rgba(245,158,11,0.4)',  bg: 'rgba(245,158,11,0.06)',  hBg: 'rgba(245,158,11,0.12)', color: '#d97706' },
        occupied  : { border: '2px solid rgba(239,68,68,0.4)',   bg: 'rgba(239,68,68,0.06)',   hBg: 'rgba(239,68,68,0.12)', color: '#dc2626' },
    }[status] || { border: '2px solid #e2e8f0', bg: '#f8fafc', hBg: '#f1f5f9', color: '#64748b' });

    const stats = {
        total    : booths.length,
        available: booths.filter(b => b.status === 'available').length,
        reserved : booths.filter(b => b.status === 'reserved').length,
        occupied : booths.filter(b => b.status === 'occupied').length,
    };

    /* ── styles ─────────────────────────────────────────────── */
    const s = {
        /* header */
        pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' },
        pageTitle : { fontSize: '22px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px', margin: '0 0 4px 0' },
        pageSub   : { fontSize: '13px', color: '#94a3b8', margin: 0 },
        headerRight: { display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' },

        expoSelect: {
            padding: '9px 14px',
            border: selectFocused ? '1.5px solid #6366f1' : '1.5px solid #e2e8f0',
            borderRadius: '10px', fontSize: '13px', fontWeight: '500',
            color: '#0f172a', background: 'white', outline: 'none',
            cursor: 'pointer', transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: selectFocused ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
        },
        bulkBtn: {
            padding: '9px 16px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none', borderRadius: '10px',
            color: 'white', fontSize: '13px', fontWeight: '700',
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
        },
        addBtn: {
            padding: '9px 16px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', borderRadius: '10px',
            color: 'white', fontSize: '13px', fontWeight: '700',
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
        },

        /* stat cards */
        statGrid: {
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))',
            gap: '14px', marginBottom: '20px',
        },
        statCard: (grad) => ({
            background: grad, borderRadius: '16px',
            padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        }),
        statIcon : { fontSize: '24px' },
        statVal  : { fontSize: '26px', fontWeight: '900', color: 'white', lineHeight: 1, margin: 0 },
        statLabel: { fontSize: '11px', color: 'rgba(255,255,255,0.75)', fontWeight: '600', margin: 0 },

        /* floor card */
        floorCard : { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' },
        legendRow : { padding: '14px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', background: '#fafafa' },
        legendText: { fontSize: '12px', fontWeight: '700', color: '#475569' },
        legendItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', fontWeight: '600' },
        legendDot : (color) => ({ width: '10px', height: '10px', borderRadius: '3px', background: color }),
        boothGrid : { padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px,1fr))', gap: '10px' },

        /* empty / loading */
        emptyCard: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '64px 32px', textAlign: 'center' },
        emptyIconWrap: {
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'rgba(99,102,241,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', margin: '0 auto 16px',
        },
        emptyTitle: { fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' },
        emptyDesc : { fontSize: '13px', color: '#94a3b8', margin: '0 0 20px 0' },
        emptyBtn  : {
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none', borderRadius: '10px',
            color: 'white', fontSize: '13px', fontWeight: '700',
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
        },
        spinWrap  : { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px' },

        /* modal overlay */
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
            boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
            overflow: 'hidden',
        },
        modalHead: {
            padding: '20px 24px', borderBottom: '1px solid #f1f5f9',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        },
        modalTitle: { fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 },
        modalSub  : { fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' },
        closeBtn  : {
            width: '30px', height: '30px', borderRadius: '8px',
            background: '#f1f5f9', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', cursor: 'pointer', color: '#64748b',
            transition: 'background 0.15s',
        },
        modalBody : { padding: '20px 24px' },
        grid2     : { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' },
        fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' },
        label     : { fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' },
        input     : (name) => ({
            width: '100%', padding: '9px 12px',
            border: focusedField === name ? '1.5px solid #6366f1' : '1.5px solid #e2e8f0',
            borderRadius: '9px', fontSize: '13px', fontWeight: '500',
            color: '#0f172a', background: 'white', outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: focusedField === name ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
            boxSizing: 'border-box', fontFamily: 'inherit',
        }),
        inputGreen: (name) => ({
            width: '100%', padding: '9px 12px',
            border: focusedField === name ? '1.5px solid #10b981' : '1.5px solid #e2e8f0',
            borderRadius: '9px', fontSize: '13px', fontWeight: '500',
            color: '#0f172a', background: 'white', outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: focusedField === name ? '0 0 0 3px rgba(16,185,129,0.1)' : 'none',
            boxSizing: 'border-box', fontFamily: 'inherit',
        }),
        btnRow    : { display: 'flex', gap: '10px', marginTop: '6px' },
        submitBtn : (color) => ({
            flex: 1, padding: '10px',
            background: color === 'green'
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', borderRadius: '10px',
            color: 'white', fontSize: '13px', fontWeight: '700',
            cursor: 'pointer', transition: 'all 0.2s',
        }),
        cancelFormBtn: {
            flex: 1, padding: '10px',
            background: '#f1f5f9', border: 'none',
            borderRadius: '10px', color: '#475569',
            fontSize: '13px', fontWeight: '700',
            cursor: 'pointer', transition: 'background 0.15s',
        },
        bulkInfoBox: {
            background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: '10px', padding: '12px 14px',
            fontSize: '13px', color: '#059669',
            fontWeight: '600', marginBottom: '14px',
        },
    };

    const focus   = (n) => () => setFocusedField(n);
    const unfocus = ()  => setFocusedField(null);

    return (
        <div>
            {/* ── Header ── */}
            <div style={s.pageHeader}>
                <div>
                    <h2 style={s.pageTitle}>Manage Booths</h2>
                    <p style={s.pageSub}>Create and manage booth spaces for your expos</p>
                </div>
                <div style={s.headerRight}>
                    <select
                        value={selectedExpo} onChange={handleExpoChange}
                        onFocus={() => setSelectFocused(true)} onBlur={() => setSelectFocused(false)}
                        style={s.expoSelect}
                    >
                        <option value="">Select Expo</option>
                        {expos.map(expo => <option key={expo._id} value={expo._id}>{expo.title}</option>)}
                    </select>
                    {selectedExpo && (
                        <>
                            <button style={s.bulkBtn} onClick={() => setShowBulkForm(true)}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >⚡ Bulk Create</button>
                            <button style={s.addBtn} onClick={() => setShowForm(true)}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >＋ Add Booth</button>
                        </>
                    )}
                </div>
            </div>

            {/* ── Stat cards ── */}
            {selectedExpo && booths.length > 0 && (
                <div style={s.statGrid}>
                    {[
                        { label: 'Total Booths', value: stats.total,     icon: '🏢', grad: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
                        { label: 'Available',    value: stats.available, icon: '✅', grad: 'linear-gradient(135deg,#10b981,#059669)' },
                        { label: 'Reserved',     value: stats.reserved,  icon: '⏳', grad: 'linear-gradient(135deg,#f59e0b,#d97706)' },
                        { label: 'Occupied',     value: stats.occupied,  icon: '🔒', grad: 'linear-gradient(135deg,#ef4444,#dc2626)' },
                    ].map((c, i) => (
                        <div key={i} style={s.statCard(c.grad)}>
                            <span style={s.statIcon}>{c.icon}</span>
                            <div>
                                <p style={s.statVal}>{c.value}</p>
                                <p style={s.statLabel}>{c.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Single Booth Modal ── */}
            {showForm && (
                <div style={s.overlay}>
                    <div style={s.modal}>
                        <div style={s.modalHead}>
                            <div>
                                <p style={s.modalTitle}>{editingBooth ? '✏️ Edit Booth' : '＋ Add New Booth'}</p>
                            </div>
                            <button style={s.closeBtn} onClick={resetForm}
                                onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                                onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                            >✕</button>
                        </div>
                        <div style={s.modalBody}>
                            <form onSubmit={handleSubmit}>
                                <div style={s.fieldGroup}>
                                    <label style={s.label}>Booth Number</label>
                                    <input type="text" required value={formData.boothNumber}
                                        placeholder="e.g. A1, B3"
                                        onChange={e => setFormData({ ...formData, boothNumber: e.target.value })}
                                        onFocus={focus('boothNumber')} onBlur={unfocus}
                                        style={s.input('boothNumber')}
                                    />
                                </div>
                                <div style={s.grid2}>
                                    <div style={{ ...s.fieldGroup, marginBottom: 0 }}>
                                        <label style={s.label}>Size</label>
                                        <select value={formData.size}
                                            onChange={e => setFormData({ ...formData, size: e.target.value })}
                                            onFocus={focus('size')} onBlur={unfocus}
                                            style={s.input('size')}
                                        >
                                            <option value="small">Small</option>
                                            <option value="medium">Medium</option>
                                            <option value="large">Large</option>
                                        </select>
                                    </div>
                                    <div style={{ ...s.fieldGroup, marginBottom: 0 }}>
                                        <label style={s.label}>Price ($)</label>
                                        <input type="number" value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            onFocus={focus('price')} onBlur={unfocus}
                                            style={s.input('price')}
                                        />
                                    </div>
                                </div>
                                <div style={{ ...s.fieldGroup, marginTop: '14px' }}>
                                    <label style={s.label}>Description</label>
                                    <textarea rows={2} value={formData.description}
                                        placeholder="Optional booth description"
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        onFocus={focus('desc')} onBlur={unfocus}
                                        style={{ ...s.input('desc'), resize: 'vertical' }}
                                    />
                                </div>
                                <div style={s.btnRow}>
                                    <button type="submit" style={s.submitBtn('indigo')}>{editingBooth ? 'Update' : 'Create'}</button>
                                    <button type="button" style={s.cancelFormBtn} onClick={resetForm}
                                        onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                                    >Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Bulk Create Modal ── */}
            {showBulkForm && (
                <div style={s.overlay}>
                    <div style={s.modal}>
                        <div style={s.modalHead}>
                            <div>
                                <p style={s.modalTitle}>⚡ Bulk Create Booths</p>
                                <p style={s.modalSub}>Auto-generates booths in a grid (e.g. 3×5 = A1–C5)</p>
                            </div>
                            <button style={s.closeBtn} onClick={() => setShowBulkForm(false)}
                                onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                                onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                            >✕</button>
                        </div>
                        <div style={s.modalBody}>
                            <form onSubmit={handleBulkCreate}>
                                <div style={s.grid2}>
                                    <div style={{ ...s.fieldGroup, marginBottom: 0 }}>
                                        <label style={s.label}>Rows</label>
                                        <input type="number" min="1" max="10" value={bulkData.rows}
                                            onChange={e => setBulkData({ ...bulkData, rows: e.target.value })}
                                            onFocus={focus('rows')} onBlur={unfocus}
                                            style={s.inputGreen('rows')}
                                        />
                                    </div>
                                    <div style={{ ...s.fieldGroup, marginBottom: 0 }}>
                                        <label style={s.label}>Columns</label>
                                        <input type="number" min="1" max="20" value={bulkData.columns}
                                            onChange={e => setBulkData({ ...bulkData, columns: e.target.value })}
                                            onFocus={focus('cols')} onBlur={unfocus}
                                            style={s.inputGreen('cols')}
                                        />
                                    </div>
                                </div>
                                <div style={{ ...s.grid2, marginTop: '14px' }}>
                                    <div style={{ ...s.fieldGroup, marginBottom: 0 }}>
                                        <label style={s.label}>Size</label>
                                        <select value={bulkData.size}
                                            onChange={e => setBulkData({ ...bulkData, size: e.target.value })}
                                            onFocus={focus('bsize')} onBlur={unfocus}
                                            style={s.inputGreen('bsize')}
                                        >
                                            <option value="small">Small</option>
                                            <option value="medium">Medium</option>
                                            <option value="large">Large</option>
                                        </select>
                                    </div>
                                    <div style={{ ...s.fieldGroup, marginBottom: 0 }}>
                                        <label style={s.label}>Price ($)</label>
                                        <input type="number" value={bulkData.price}
                                            onChange={e => setBulkData({ ...bulkData, price: e.target.value })}
                                            onFocus={focus('bprice')} onBlur={unfocus}
                                            style={s.inputGreen('bprice')}
                                        />
                                    </div>
                                </div>
                                <div style={{ ...s.bulkInfoBox, marginTop: '14px' }}>
                                    Will create <strong>{bulkData.rows * bulkData.columns}</strong> booths
                                </div>
                                <div style={s.btnRow}>
                                    <button type="submit" style={s.submitBtn('green')}>Generate Booths</button>
                                    <button type="button" style={s.cancelFormBtn} onClick={() => setShowBulkForm(false)}
                                        onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                                    >Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Floor plan / states ── */}
            {!selectedExpo ? (
                <div style={s.emptyCard}>
                    <div style={s.emptyIconWrap}>🏢</div>
                    <h3 style={s.emptyTitle}>No Expo Selected</h3>
                    <p style={s.emptyDesc}>Select an expo from the dropdown to manage its booths.</p>
                </div>
            ) : loading ? (
                <div style={s.spinWrap}>
                    <div style={{ width:'40px', height:'40px', borderRadius:'50%', border:'4px solid #6366f1', borderTopColor:'transparent', animation:'spin 0.8s linear infinite' }} />
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
            ) : booths.length === 0 ? (
                <div style={s.emptyCard}>
                    <div style={{ ...s.emptyIconWrap, background: '#f8fafc' }}>📭</div>
                    <h3 style={s.emptyTitle}>No Booths Yet</h3>
                    <p style={s.emptyDesc}>Use Bulk Create to generate a floor plan instantly.</p>
                    <button style={s.emptyBtn} onClick={() => setShowBulkForm(true)}>⚡ Bulk Create Booths</button>
                </div>
            ) : (
                <div style={s.floorCard}>
                    {/* Legend */}
                    <div style={s.legendRow}>
                        <span style={s.legendText}>Legend:</span>
                        {[
                            { label: 'Available', color: '#10b981' },
                            { label: 'Reserved',  color: '#f59e0b' },
                            { label: 'Occupied',  color: '#ef4444' },
                        ].map((l, i) => (
                            <div key={i} style={s.legendItem}>
                                <div style={s.legendDot(l.color)} />
                                {l.label}
                            </div>
                        ))}
                    </div>

                    {/* Booth grid */}
                    <div style={s.boothGrid}>
                        {booths.map(booth => {
                            const t = boothTheme(booth.status);
                            return (
                                <BoothCell
                                    key={booth._id}
                                    booth={booth}
                                    theme={t}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

/* ── Booth cell (separate component for clean hover state) ── */
const BoothCell = ({ booth, theme: t, onEdit, onDelete }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            style={{
                position: 'relative', borderRadius: '12px',
                border: t.border, background: hovered ? t.hBg : t.bg,
                padding: '10px 6px', textAlign: 'center',
                cursor: 'pointer', transition: 'all 0.15s',
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
                boxShadow: hovered ? '0 6px 18px rgba(0,0,0,0.1)' : 'none',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Normal view */}
            {!hovered && (
                <>
                    <p style={{ fontSize: '14px', fontWeight: '900', color: t.color, margin: '0 0 2px 0' }}>{booth.boothNumber}</p>
                    <p style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'capitalize', margin: '0 0 2px 0' }}>{booth.size}</p>
                    <p style={{ fontSize: '11px', fontWeight: '700', color: '#0f172a', margin: 0 }}>${booth.price}</p>
                </>
            )}

            {/* Hover overlay */}
            {hovered && (
                <div style={{
                    position: 'absolute', inset: 0, borderRadius: '12px',
                    background: 'rgba(15,23,42,0.88)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '6px',
                }}>
                    <button
                        onClick={() => onEdit(booth)}
                        style={{
                            width: '100%', padding: '5px',
                            background: 'rgba(99,102,241,0.9)', border: 'none',
                            borderRadius: '7px', color: 'white',
                            fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                        }}
                    >✏️ Edit</button>
                    <button
                        onClick={() => onDelete(booth._id)}
                        style={{
                            width: '100%', padding: '5px',
                            background: 'rgba(239,68,68,0.9)', border: 'none',
                            borderRadius: '7px', color: 'white',
                            fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                        }}
                    >🗑️ Delete</button>
                </div>
            )}
        </div>
    );
};

export default ManageBooths;