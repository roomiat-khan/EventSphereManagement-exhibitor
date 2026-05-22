import { useState, useEffect } from 'react';
import { getExpos, getBoothsByExpo } from '../../services/api';
import { toast } from 'react-toastify';

const SearchExhibitors = () => {
    const [expos, setExpos] = useState([]);
    const [booths, setBooths] = useState([]);
    const [selectedExpo, setSelectedExpo] = useState('');
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [selectedExhibitor, setSelectedExhibitor] = useState(null);

    const CATEGORIES = ['all', 'technology', 'healthcare', 'education', 'finance', 'retail', 'food', 'other'];

    useEffect(() => { fetchExpos(); }, []);

    const fetchExpos = async () => {
        try {
            const res = await getExpos();
            setExpos(res.data);
        } catch { toast.error('Failed to load expos'); }
    };

    const fetchBooths = async (expoId) => {
        setLoading(true);
        try {
            const res = await getBoothsByExpo(expoId);
            // Only show occupied booths (have exhibitors)
            setBooths(res.data.filter(b => b.status === 'occupied' && b.exhibitor));
        } catch { toast.error('Failed to load exhibitors'); }
        finally { setLoading(false); }
    };

    const handleExpoChange = (e) => {
        setSelectedExpo(e.target.value);
        setSearch('');
        setCategoryFilter('all');
        setSelectedExhibitor(null);
        if (e.target.value) fetchBooths(e.target.value);
        else setBooths([]);
    };

    const filtered = booths.filter(booth => {
        const exhibitor = booth.exhibitor;
        const matchSearch = !search ||
            exhibitor?.name?.toLowerCase().includes(search.toLowerCase()) ||
            exhibitor?.companyName?.toLowerCase().includes(search.toLowerCase()) ||
            booth.boothNumber?.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    const categoryColor = (cat) => ({
        technology: { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1' },
        healthcare: { bg: 'rgba(16,185,129,0.1)',  color: '#059669' },
        education:  { bg: 'rgba(245,158,11,0.1)',  color: '#d97706' },
        finance:    { bg: 'rgba(6,182,212,0.1)',   color: '#0891b2' },
        retail:     { bg: 'rgba(139,92,246,0.1)',  color: '#7c3aed' },
        food:       { bg: 'rgba(236,72,153,0.1)',  color: '#db2777' },
        other:      { bg: 'rgba(148,163,184,0.1)', color: '#64748b' },
    }[cat] || { bg: 'rgba(148,163,184,0.1)', color: '#64748b' });

    const s = {
        page: { fontFamily: "'Segoe UI',system-ui,sans-serif" },

        // Header
        header: { marginBottom: '24px' },
        title: { fontSize: '22px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px', margin: '0 0 4px 0' },
        subtitle: { fontSize: '13px', color: '#94a3b8', margin: 0 },

        // Controls
        controls: { background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '20px' },
        controlsGrid: { display: 'grid', gridTemplateColumns: '1.5fr 2fr', gap: '12px', marginBottom: '16px' },
        label: { display: 'block', fontSize: '11px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' },
        select: { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#0f172a', outline: 'none', background: '#f8fafc', cursor: 'pointer', transition: 'all 0.2s' },
        searchWrap: { position: 'relative' },
        searchInput: { width: '100%', padding: '10px 14px 10px 40px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#0f172a', outline: 'none', background: '#f8fafc', transition: 'all 0.2s', boxSizing: 'border-box' },
        searchIcon: { position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8' },

        // Category filters
        catRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
        catBtn: (active, cat) => ({
            padding: '5px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: '700',
            border: 'none', cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize',
            background: active ? (cat === 'all' ? '#6366f1' : categoryColor(cat).bg) : '#f1f5f9',
            color: active ? (cat === 'all' ? 'white' : categoryColor(cat).color) : '#64748b',
            boxShadow: active ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
        }),

        // Results info
        resultsInfo: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
        resultsCount: { fontSize: '13px', color: '#64748b', fontWeight: '500' },

        // Grid
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },

        // Exhibitor card
        card: { background: 'white', borderRadius: '18px', border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer' },
        cardTop: { padding: '20px 20px 16px', borderBottom: '1px solid #f8fafc' },
        cardAvatar: { width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', color: 'white', marginBottom: '12px' },
        cardName: { fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' },
        cardCompany: { fontSize: '12px', color: '#64748b', margin: 0 },
        cardBottom: { padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        boothBadge: { background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#6366f1', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '700' },
        viewBtn: { padding: '6px 14px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },

        // Modal overlay
        overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px', backdropFilter: 'blur(4px)' },
        modal: { background: 'white', borderRadius: '24px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' },
        modalHead: { padding: '24px 28px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
        modalCloseBtn: { width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', cursor: 'pointer', color: '#64748b', flexShrink: 0 },
        modalBody: { padding: '24px 28px' },
        modalSection: { marginBottom: '20px' },
        modalSectionTitle: { fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' },
        infoRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid #f8fafc' },
        infoLabel: { fontSize: '12px', color: '#94a3b8', width: '90px', flexShrink: 0 },
        infoVal: { fontSize: '13px', color: '#0f172a', fontWeight: '600' },

        // Empty
        empty: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '60px 32px', textAlign: 'center' },
        emptyIcon: { fontSize: '48px', marginBottom: '16px' },
        emptyText: { fontSize: '15px', color: '#94a3b8', fontWeight: '500', margin: 0 },
    };

    const getAvatarColor = (i) => [
        'linear-gradient(135deg,#6366f1,#8b5cf6)',
        'linear-gradient(135deg,#10b981,#059669)',
        'linear-gradient(135deg,#f59e0b,#d97706)',
        'linear-gradient(135deg,#06b6d4,#0891b2)',
        'linear-gradient(135deg,#ec4899,#db2777)',
        'linear-gradient(135deg,#f97316,#ea580c)',
    ][i % 6];

    const focusInput = (e) => { e.target.style.border = '1.5px solid #6366f1'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; };
    const blurInput  = (e) => { e.target.style.border = '1.5px solid #e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; };

    return (
        <div style={s.page}>
            <style>{`
                @media (max-width: 640px) {
                    .se-controls-grid { grid-template-columns: 1fr !important; }
                    .se-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>

            {/* Header */}
            <div style={s.header}>
                <h2 style={s.title}>🔍 Search Exhibitors</h2>
                <p style={s.subtitle}>Find and connect with exhibitors at your expo</p>
            </div>

            {/* Controls */}
            <div style={s.controls}>
                <div style={s.controlsGrid} className="se-controls-grid">
                    <div>
                        <label style={s.label}>Select Expo</label>
                        <select value={selectedExpo} onChange={handleExpoChange} style={s.select}
                            onFocus={focusInput} onBlur={blurInput}
                        >
                            <option value="">Choose an expo...</option>
                            {expos.map(expo => (
                                <option key={expo._id} value={expo._id}>{expo.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={s.label}>Search Exhibitor</label>
                        <div style={s.searchWrap}>
                            <span style={s.searchIcon}>🔍</span>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by name, company, booth..."
                                style={s.searchInput}
                                disabled={!selectedExpo}
                                onFocus={focusInput} onBlur={blurInput}
                            />
                        </div>
                    </div>
                </div>

                {/* Category Filter */}
                <div>
                    <label style={s.label}>Filter by Category</label>
                    <div style={s.catRow}>
                        {CATEGORIES.map(cat => (
                            <button key={cat} style={s.catBtn(categoryFilter === cat, cat)}
                                onClick={() => setCategoryFilter(cat)}
                            >
                                {cat === 'all' ? '🌐 All' : cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Exhibitor Detail Modal */}
            {selectedExhibitor && (
                <div style={s.overlay} onClick={() => setSelectedExhibitor(null)}>
                    <div style={s.modal} onClick={e => e.stopPropagation()}>
                        <div style={s.modalHead}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{ ...s.cardAvatar, background: getAvatarColor(0), margin: 0, width: '52px', height: '52px', borderRadius: '16px' }}>
                                    {selectedExhibitor.exhibitor?.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 3px 0' }}>
                                        {selectedExhibitor.exhibitor?.companyName || selectedExhibitor.exhibitor?.name}
                                    </h3>
                                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                                        Booth #{selectedExhibitor.boothNumber}
                                    </p>
                                </div>
                            </div>
                            <button style={s.modalCloseBtn} onClick={() => setSelectedExhibitor(null)}
                                onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                                onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                            >✕</button>
                        </div>

                        <div style={s.modalBody}>
                            {/* Contact Info */}
                            <div style={s.modalSection}>
                                <div style={s.modalSectionTitle}>📋 Contact Information</div>
                                {[
                                    { label: 'Name',    val: selectedExhibitor.exhibitor?.name },
                                    { label: 'Email',   val: selectedExhibitor.exhibitor?.email },
                                    { label: 'Phone',   val: selectedExhibitor.exhibitor?.phone || '—' },
                                    { label: 'Company', val: selectedExhibitor.exhibitor?.companyName || '—' },
                                ].map((row, i) => (
                                    <div key={i} style={s.infoRow}>
                                        <span style={s.infoLabel}>{row.label}</span>
                                        <span style={s.infoVal}>{row.val}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Booth Info */}
                            <div style={s.modalSection}>
                                <div style={s.modalSectionTitle}>🏢 Booth Details</div>
                                {[
                                    { label: 'Booth No',  val: `#${selectedExhibitor.boothNumber}` },
                                    { label: 'Size',      val: selectedExhibitor.size },
                                    { label: 'Price',     val: `$${selectedExhibitor.price}` },
                                    { label: 'Status',    val: selectedExhibitor.status },
                                ].map((row, i) => (
                                    <div key={i} style={s.infoRow}>
                                        <span style={s.infoLabel}>{row.label}</span>
                                        <span style={{ ...s.infoVal, textTransform: 'capitalize' }}>{row.val}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Contact Button */}
                            <a
                                href={`mailto:${selectedExhibitor.exhibitor?.email}`}
                                style={{ display: 'block', textAlign: 'center', padding: '13px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '12px', color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '700', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}
                            >
                                📧 Contact via Email
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Results */}
            {!selectedExpo ? (
                <div style={s.empty}>
                    <div style={s.emptyIcon}>🎪</div>
                    <p style={s.emptyText}>Select an expo to browse exhibitors</p>
                </div>
            ) : loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <span style={{ color: '#94a3b8', fontSize: '14px' }}>Loading exhibitors...</span>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : filtered.length === 0 ? (
                <div style={s.empty}>
                    <div style={s.emptyIcon}>🔍</div>
                    <p style={s.emptyText}>{booths.length === 0 ? 'No exhibitors found for this expo' : 'No results match your search'}</p>
                </div>
            ) : (
                <>
                    <div style={s.resultsInfo}>
                        <span style={s.resultsCount}>
                            Showing <strong>{filtered.length}</strong> exhibitor{filtered.length !== 1 ? 's' : ''}
                            {search && ` for "${search}"`}
                        </span>
                    </div>

                    <div style={s.grid} className="se-grid">
                        {filtered.map((booth, i) => (
                            <div key={booth._id} style={s.card}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#6366f1'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                            >
                                <div style={s.cardTop}>
                                    <div style={{ ...s.cardAvatar, background: getAvatarColor(i) }}>
                                        {booth.exhibitor?.name?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                    <h3 style={s.cardName}>
                                        {booth.exhibitor?.companyName || booth.exhibitor?.name || 'Unknown'}
                                    </h3>
                                    <p style={s.cardCompany}>
                                        👤 {booth.exhibitor?.name} &nbsp;·&nbsp; 📧 {booth.exhibitor?.email}
                                    </p>
                                </div>
                                <div style={s.cardBottom}>
                                    <span style={s.boothBadge}>🏢 Booth #{booth.boothNumber}</span>
                                    <button style={s.viewBtn}
                                        onClick={() => setSelectedExhibitor(booth)}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default SearchExhibitors;