import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExpos } from '../../services/api';
import { toast } from 'react-toastify';

/* ─── responsive hook ─── */
function useIsMobile(breakpoint = 600) {
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== 'undefined' && window.innerWidth < breakpoint
    );
    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [breakpoint]);
    return isMobile;
}

const BrowseExpos = () => {
    const [expos, setExpos]               = useState([]);
    const [loading, setLoading]           = useState(true);
    const [search, setSearch]             = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const navigate  = useNavigate();
    const isMobile  = useIsMobile();

    useEffect(() => { fetchExpos(); }, []);

    const fetchExpos = async () => {
        try {
            const res = await getExpos();
            // guard: make sure res.data is always an array
            setExpos(Array.isArray(res.data) ? res.data : []);
        } catch {
            toast.error('Failed to load expos');
        } finally {
            setLoading(false);
        }
    };

    const filtered = expos.filter(e => {
        const q = search.toLowerCase();
        return (
            e.title?.toLowerCase().includes(q) ||
            e.location?.toLowerCase().includes(q) ||
            e.theme?.toLowerCase().includes(q)
        );
    });

    const statusStyle = (status) => {
        const map = {
            published : { background: 'rgba(99,102,241,0.1)',  border: '1px solid rgba(99,102,241,0.3)',  color: '#6366f1' },
            ongoing   : { background: 'rgba(16,185,129,0.1)',  border: '1px solid rgba(16,185,129,0.3)',  color: '#059669' },
            completed : { background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.3)', color: '#64748b' },
        };
        return map[status] ?? { background: 'rgba(148,163,184,0.1)', border: '1px solid #e2e8f0', color: '#64748b' };
    };

    const s = {
        loading: {
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '60px', fontSize: '14px', color: '#94a3b8', fontWeight: '500',
        },

        /* header row */
        header: {
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            marginBottom: '24px',
            gap: '12px',
        },
        pageTitle: {
            fontSize: isMobile ? '18px' : '22px',
            fontWeight: '900', color: '#0f172a',
            letterSpacing: '-0.5px', margin: 0,
        },

        /* search */
        searchBox: {
            position: 'relative',
            width: isMobile ? '100%' : 'auto',
        },
        searchIcon: {
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)', fontSize: '14px',
            pointerEvents: 'none',
        },
        searchInput: {
            padding: '9px 14px 9px 34px',
            border: searchFocused ? '1.5px solid #6366f1' : '1.5px solid #e2e8f0',
            borderRadius: '10px', fontSize: '13px', fontWeight: '500',
            color: '#0f172a', background: 'white', outline: 'none',
            width: isMobile ? '100%' : '220px',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: searchFocused ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
        },

        /* empty state */
        empty: {
            background: 'white', borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: isMobile ? '40px 20px' : '64px 32px',
            textAlign: 'center',
        },
        emptyIcon  : { fontSize: '52px', marginBottom: '16px' },
        emptyTitle : { fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 },

        /* grid — 1 col on mobile, auto-fill on larger screens */
        grid: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: isMobile ? '16px' : '20px',
        },

        /* expo card */
        card: {
            background: 'white', borderRadius: '20px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden', transition: 'all 0.2s',
        },

        banner: {
            background: 'linear-gradient(135deg, #0f172a, #1e1b4b)',
            height: isMobile ? '72px' : '96px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
        },
        bannerGlow: {
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(ellipse at 70% 50%, rgba(99,102,241,0.3) 0%, transparent 65%)',
        },
        bannerIcon: { fontSize: isMobile ? '36px' : '44px', position: 'relative', zIndex: 1 },

        cardBody: { padding: isMobile ? '16px' : '20px' },
        cardTop: {
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', marginBottom: '8px', gap: '8px',
        },
        cardTitle: {
            fontSize: '15px', fontWeight: '800', color: '#0f172a',
            margin: 0, lineHeight: '1.3',
        },
        statusBadge: (status) => ({
            ...statusStyle(status),
            padding: '3px 10px', borderRadius: '100px',
            fontSize: '10px', fontWeight: '700',
            textTransform: 'capitalize', whiteSpace: 'nowrap', flexShrink: 0,
        }),
        theme: { fontSize: '12px', color: '#6366f1', fontWeight: '600', margin: '0 0 6px 0' },
        meta : { fontSize: '12px', color: '#94a3b8', margin: '0 0 3px 0' },
        desc : {
            fontSize: '13px', color: '#475569', margin: '8px 0 16px 0',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            lineHeight: '1.5',
        },

        btn: {
            width: '100%', padding: '10px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', borderRadius: '10px',
            color: 'white', fontSize: '13px', fontWeight: '700',
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(99,102,241,0.25)',
        },
    };

    /* safe date formatter — avoids Invalid Date showing on bad data */
    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return isNaN(d) ? '—' : d.toLocaleDateString();
    };

    if (loading) return <div style={s.loading}>⏳ Loading expos...</div>;

    return (
        <div>
            {/* Header */}
            <div style={s.header}>
                <h2 style={s.pageTitle}>Browse Expos</h2>
                <div style={s.searchBox}>
                    <span style={s.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search expos..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        style={s.searchInput}
                    />
                </div>
            </div>

            {filtered.length === 0 ? (
                <div style={s.empty}>
                    <div style={s.emptyIcon}>🎪</div>
                    <p style={s.emptyTitle}>No expos found.</p>
                </div>
            ) : (
                <div style={s.grid}>
                    {filtered.map(expo => (
                        <div
                            key={expo._id}
                            style={s.card}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform   = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow   = '0 12px 40px rgba(0,0,0,0.1)';
                                e.currentTarget.style.borderColor = '#6366f1';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform   = 'translateY(0)';
                                e.currentTarget.style.boxShadow   = 'none';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                            }}
                        >
                            <div style={s.banner}>
                                <div style={s.bannerGlow} />
                                <span style={s.bannerIcon}>🎪</span>
                            </div>

                            <div style={s.cardBody}>
                                <div style={s.cardTop}>
                                    <h3 style={s.cardTitle}>{expo.title}</h3>
                                    <span style={s.statusBadge(expo.status)}>{expo.status}</span>
                                </div>

                                {expo.theme && <p style={s.theme}>🎯 {expo.theme}</p>}

                                <p style={s.meta}>📍 {expo.location}</p>
                                <p style={s.meta}>
                                    📅 {formatDate(expo.startDate)} — {formatDate(expo.endDate)}
                                </p>

                                <p style={s.desc}>{expo.description}</p>

                                <button
                                    style={s.btn}
                                    onClick={() => navigate(`/attendee/sessions?expoId=${expo._id}`)}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(99,102,241,0.4)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.25)';
                                    }}
                                >
                                    View Sessions
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BrowseExpos;