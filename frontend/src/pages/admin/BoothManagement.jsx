import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BoothManagement = () => {
    const [expos, setExpos] = useState([]);
    const [selectedExpo, setSelectedExpo] = useState('');
    const [booths, setBooths] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectFocused, setSelectFocused] = useState(false);

    useEffect(() => { fetchExpos(); }, []);

    const fetchExpos = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/expos', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setExpos(res.data);
        } catch (error) {
            toast.error('Failed to load expos');
        }
    };

    const fetchBooths = async (expoId) => {
        if (!expoId) return;
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/booths/expo/${expoId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setBooths(res.data);
        } catch (error) {
            toast.error('Failed to load booths');
        } finally {
            setLoading(false);
        }
    };

    const handleExpoChange = (e) => {
        const expoId = e.target.value;
        setSelectedExpo(expoId);
        fetchBooths(expoId);
    };

    /* booth status colours */
    const boothTheme = (status) => {
        const map = {
            available : {
                border    : '2px solid rgba(16,185,129,0.5)',
                background: 'rgba(16,185,129,0.06)',
                hoverBg   : 'rgba(16,185,129,0.12)',
                pill      : { background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#059669' },
                numColor  : '#059669',
            },
            reserved : {
                border    : '2px solid rgba(245,158,11,0.5)',
                background: 'rgba(245,158,11,0.06)',
                hoverBg   : 'rgba(245,158,11,0.1)',
                pill      : { background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#d97706' },
                numColor  : '#d97706',
            },
        };
        return map[status] || {
            border    : '2px solid #e2e8f0',
            background: '#f8fafc',
            hoverBg   : '#f1f5f9',
            pill      : { background: 'rgba(148,163,184,0.1)', border: '1px solid #e2e8f0', color: '#64748b' },
            numColor  : '#94a3b8',
        };
    };

    /* ── styles ─────────────────────────────────────────────── */
    const s = {
        /* page header */
        pageHeader: { marginBottom: '24px' },
        pageTitle : { fontSize: '22px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px', margin: '0 0 4px 0' },
        pageSub   : { fontSize: '13px', color: '#94a3b8', margin: 0 },

        /* select card */
        selectCard: {
            background: 'white', borderRadius: '20px',
            border: '1px solid #e2e8f0', padding: '24px',
            marginBottom: '20px',
        },
        selectLabel: {
            fontSize: '12px', fontWeight: '700', color: '#475569',
            textTransform: 'uppercase', letterSpacing: '0.05em',
            display: 'block', marginBottom: '10px',
        },
        select: {
            width: '100%', maxWidth: '480px',
            padding: '10px 14px',
            border: selectFocused ? '1.5px solid #6366f1' : '1.5px solid #e2e8f0',
            borderRadius: '10px', fontSize: '14px', fontWeight: '500',
            color: '#0f172a', background: 'white', outline: 'none',
            cursor: 'pointer', transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: selectFocused ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
        },

        /* floor plan card */
        floorCard: {
            background: 'white', borderRadius: '20px',
            border: '1px solid #e2e8f0', overflow: 'hidden',
        },
        floorHead: {
            padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        },
        floorTitle: { fontSize: '15px', fontWeight: '800', color: '#0f172a' },
        floorCount: { fontSize: '13px', color: '#94a3b8' },
        floorCountBold: { fontWeight: '800', color: '#0f172a' },

        /* legend */
        legend: {
            display: 'flex', gap: '20px', flexWrap: 'wrap',
            padding: '12px 24px', borderBottom: '1px solid #f1f5f9',
            background: '#fafafa',
        },
        legendItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', fontWeight: '600' },
        legendDot : (color) => ({ width: '10px', height: '10px', borderRadius: '50%', background: color }),

        /* grid */
        grid: {
            padding: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
            gap: '12px',
        },

        /* loading */
        loadingWrap: {
            padding: '60px', textAlign: 'center',
            fontSize: '14px', color: '#94a3b8', fontWeight: '500',
        },
    };

    /* booth card style (dynamic per status) */
    const boothCard = (status) => {
        const t = boothTheme(status);
        return {
            aspectRatio  : '1 / 1',
            borderRadius : '16px',
            border       : t.border,
            background   : t.background,
            display      : 'flex', flexDirection: 'column',
            alignItems   : 'center', justifyContent: 'center',
            cursor       : 'default',
            transition   : 'transform 0.15s, box-shadow 0.15s',
            padding      : '8px',
            textAlign    : 'center',
        };
    };

    const available = booths.filter(b => b.status === 'available').length;
    const reserved  = booths.filter(b => b.status === 'reserved').length;
    const other     = booths.length - available - reserved;

    return (
        <div>
            {/* Page header */}
            <div style={s.pageHeader}>
                <h1 style={s.pageTitle}>Booth Management</h1>
                <p style={s.pageSub}>Monitor and manage all booth allocations</p>
            </div>

            {/* Expo selector */}
            <div style={s.selectCard}>
                <label style={s.selectLabel}>Select Expo</label>
                <select
                    value={selectedExpo}
                    onChange={handleExpoChange}
                    onFocus={() => setSelectFocused(true)}
                    onBlur={() => setSelectFocused(false)}
                    style={s.select}
                >
                    <option value="">-- Choose an Expo --</option>
                    {expos.map(expo => (
                        <option key={expo._id} value={expo._id}>
                            {expo.title} — {expo.location}
                        </option>
                    ))}
                </select>
            </div>

            {/* Floor plan */}
            {selectedExpo && (
                <div style={s.floorCard}>
                    {/* Header */}
                    <div style={s.floorHead}>
                        <span style={s.floorTitle}>🗺️ Booth Floor Plan</span>
                        <span style={s.floorCount}>
                            Total: <span style={s.floorCountBold}>{booths.length}</span>
                        </span>
                    </div>

                    {/* Legend */}
                    <div style={s.legend}>
                        <div style={s.legendItem}>
                            <div style={s.legendDot('#10b981')} />
                            Available ({available})
                        </div>
                        <div style={s.legendItem}>
                            <div style={s.legendDot('#f59e0b')} />
                            Reserved ({reserved})
                        </div>
                        {other > 0 && (
                            <div style={s.legendItem}>
                                <div style={s.legendDot('#94a3b8')} />
                                Other ({other})
                            </div>
                        )}
                    </div>

                    {/* Grid / loading */}
                    {loading ? (
                        <div style={s.loadingWrap}>⏳ Loading booths...</div>
                    ) : (
                        <div style={s.grid}>
                            {booths.map(booth => {
                                const t = boothTheme(booth.status);
                                return (
                                    <div
                                        key={booth._id}
                                        style={boothCard(booth.status)}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform  = 'scale(1.06)';
                                            e.currentTarget.style.boxShadow  = '0 8px 20px rgba(0,0,0,0.1)';
                                            e.currentTarget.style.background = t.hoverBg;
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform  = 'scale(1)';
                                            e.currentTarget.style.boxShadow  = 'none';
                                            e.currentTarget.style.background = t.background;
                                        }}
                                    >
                                        {/* Booth number */}
                                        <div style={{ fontSize: '20px', fontWeight: '900', color: t.numColor, lineHeight: 1 }}>
                                            {booth.boothNumber}
                                        </div>

                                        {/* Size */}
                                        <div style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', marginTop: '4px', textTransform: 'capitalize' }}>
                                            {booth.size}
                                        </div>

                                        {/* Price */}
                                        <div style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
                                            ${booth.price}
                                        </div>

                                        {/* Status pill */}
                                        <div style={{
                                            ...t.pill,
                                            marginTop: '8px', padding: '2px 8px',
                                            borderRadius: '100px', fontSize: '9px',
                                            fontWeight: '800', letterSpacing: '0.04em',
                                            textTransform: 'uppercase',
                                        }}>
                                            {booth.status}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BoothManagement;