import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ExposManagement = () => {
    const [expos, setExpos] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [focusedField, setFocusedField] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', theme: '',
        startDate: '', endDate: '', location: '', totalBooths: 50,
    });

    useEffect(() => { fetchExpos(); }, []);

    const fetchExpos = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/expos', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setExpos(res.data);
        } catch (error) {
            toast.error('Failed to load expos');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/expos', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success('Expo created successfully!');
            setShowCreateForm(false);
            setFormData({ title: '', description: '', theme: '', startDate: '', endDate: '', location: '', totalBooths: 50 });
            fetchExpos();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create expo');
        }
    };

    const deleteExpo = async (id) => {
        if (!window.confirm('Are you sure you want to delete this expo?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/expos/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success('Expo deleted');
            fetchExpos();
        } catch (error) {
            toast.error('Failed to delete expo');
        }
    };

    /* ── styles ─────────────────────────────────────────────── */
    const s = {
        /* page header */
        pageHeader: {
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap',
        },
        pageTitle: { fontSize: '22px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px', margin: 0 },

        /* create button */
        createBtn: {
            padding: '10px 20px',
            background: showCreateForm
                ? 'rgba(239,68,68,0.08)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: showCreateForm ? '1px solid rgba(239,68,68,0.3)' : 'none',
            color: showCreateForm ? '#ef4444' : 'white',
            borderRadius: '12px', fontSize: '13px', fontWeight: '700',
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: showCreateForm ? 'none' : '0 4px 14px rgba(99,102,241,0.3)',
            display: 'flex', alignItems: 'center', gap: '6px',
        },

        /* form card */
        formCard: {
            background: 'white', borderRadius: '20px',
            border: '1px solid #e2e8f0', overflow: 'hidden',
            marginBottom: '20px',
        },
        formHead: {
            padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', gap: '10px',
        },
        formHeadIcon: {
            width: '28px', height: '28px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', color: 'white', flexShrink: 0,
        },
        formTitle: { fontSize: '15px', fontWeight: '800', color: '#0f172a' },
        formBody : { padding: '24px' },
        grid2    : { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
        fullRow  : { marginBottom: '16px' },
        fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
        label: {
            fontSize: '12px', fontWeight: '700', color: '#475569',
            textTransform: 'uppercase', letterSpacing: '0.05em',
        },
        input: (name) => ({
            width: '100%', padding: '10px 14px',
            border: focusedField === name ? '1.5px solid #6366f1' : '1.5px solid #e2e8f0',
            borderRadius: '10px', fontSize: '14px', fontWeight: '500',
            color: '#0f172a', background: 'white', outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: focusedField === name ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
            boxSizing: 'border-box', fontFamily: 'inherit',
        }),
        textarea: (name) => ({
            width: '100%', padding: '10px 14px',
            border: focusedField === name ? '1.5px solid #6366f1' : '1.5px solid #e2e8f0',
            borderRadius: '10px', fontSize: '14px', fontWeight: '500',
            color: '#0f172a', background: 'white', outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: focusedField === name ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
            boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit',
        }),
        submitBtn: {
            width: '100%', padding: '13px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', borderRadius: '12px',
            color: 'white', fontSize: '14px', fontWeight: '700',
            cursor: 'pointer', marginTop: '8px', transition: 'all 0.2s',
            boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
        },

        /* list card */
        listCard: {
            background: 'white', borderRadius: '20px',
            border: '1px solid #e2e8f0', overflow: 'hidden',
        },
        listHead: {
            padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        },
        listTitle: { fontSize: '15px', fontWeight: '800', color: '#0f172a' },
        listCount: { fontSize: '12px', color: '#94a3b8' },

        /* expo row */
        expoRow: {
            padding: '18px 24px',
            borderBottom: '1px solid #f8fafc',
            display: 'flex', alignItems: 'center',
            gap: '16px', flexWrap: 'wrap',
            transition: 'background 0.15s',
            background: 'white',
        },
        expoIcon: {
            width: '44px', height: '44px', flexShrink: 0,
            background: 'linear-gradient(135deg, #0f172a, #1e1b4b)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px',
        },
        expoInfo : { flex: 1, minWidth: '160px' },
        expoTitle: { fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '0 0 2px 0' },
        expoLoc  : { fontSize: '13px', color: '#64748b', margin: '0 0 2px 0' },
        expoDates: { fontSize: '12px', color: '#94a3b8', margin: 0 },
        rowBtns  : { display: 'flex', gap: '8px', flexShrink: 0 },

        editBtn: {
            padding: '7px 16px',
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.25)',
            color: '#6366f1', borderRadius: '8px',
            fontSize: '12px', fontWeight: '700',
            cursor: 'pointer', transition: 'all 0.15s',
        },
        deleteBtn: {
            padding: '7px 16px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            color: '#ef4444', borderRadius: '8px',
            fontSize: '12px', fontWeight: '700',
            cursor: 'pointer', transition: 'all 0.15s',
        },

        /* states */
        stateText: {
            padding: '60px 32px', textAlign: 'center',
            fontSize: '14px', color: '#94a3b8', fontWeight: '500',
        },
    };

    const focus   = (name) => () => setFocusedField(name);
    const unfocus = ()     => setFocusedField(null);

    return (
        <div>
            {/* Page header */}
            <div style={s.pageHeader}>
                <h1 style={s.pageTitle}>Manage Expos</h1>
                <button
                    style={s.createBtn}
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    onMouseEnter={e => {
                        if (!showCreateForm) e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.4)';
                    }}
                    onMouseLeave={e => {
                        if (!showCreateForm) e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.3)';
                    }}
                >
                    {showCreateForm ? '✕ Cancel' : '＋ Create New Expo'}
                </button>
            </div>

            {/* ── Create form ── */}
            {showCreateForm && (
                <div style={s.formCard}>
                    <div style={s.formHead}>
                        <div style={s.formHeadIcon}>🎪</div>
                        <span style={s.formTitle}>Create New Expo</span>
                    </div>
                    <div style={s.formBody}>
                        <form onSubmit={handleSubmit}>
                            {/* Row 1 */}
                            <div style={s.grid2}>
                                <div style={s.fieldGroup}>
                                    <label style={s.label}>Expo Title</label>
                                    <input
                                        type="text" name="title" required
                                        value={formData.title} onChange={handleChange}
                                        placeholder="Tech Expo 2026"
                                        onFocus={focus('title')} onBlur={unfocus}
                                        style={s.input('title')}
                                    />
                                </div>
                                <div style={s.fieldGroup}>
                                    <label style={s.label}>Location</label>
                                    <input
                                        type="text" name="location" required
                                        value={formData.location} onChange={handleChange}
                                        placeholder="Karachi Expo Center"
                                        onFocus={focus('location')} onBlur={unfocus}
                                        style={s.input('location')}
                                    />
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div style={s.grid2}>
                                <div style={s.fieldGroup}>
                                    <label style={s.label}>Start Date</label>
                                    <input
                                        type="date" name="startDate" required
                                        value={formData.startDate} onChange={handleChange}
                                        onFocus={focus('startDate')} onBlur={unfocus}
                                        style={s.input('startDate')}
                                    />
                                </div>
                                <div style={s.fieldGroup}>
                                    <label style={s.label}>End Date</label>
                                    <input
                                        type="date" name="endDate" required
                                        value={formData.endDate} onChange={handleChange}
                                        onFocus={focus('endDate')} onBlur={unfocus}
                                        style={s.input('endDate')}
                                    />
                                </div>
                            </div>

                            {/* Theme */}
                            <div style={{ ...s.fullRow }}>
                                <div style={s.fieldGroup}>
                                    <label style={s.label}>Theme</label>
                                    <input
                                        type="text" name="theme"
                                        value={formData.theme} onChange={handleChange}
                                        placeholder="Innovation & Technology"
                                        onFocus={focus('theme')} onBlur={unfocus}
                                        style={s.input('theme')}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div style={s.fullRow}>
                                <div style={s.fieldGroup}>
                                    <label style={s.label}>Description</label>
                                    <textarea
                                        name="description" rows={4}
                                        value={formData.description} onChange={handleChange}
                                        placeholder="Describe your expo..."
                                        onFocus={focus('description')} onBlur={unfocus}
                                        style={s.textarea('description')}
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                style={s.submitBtn}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform  = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow  = '0 8px 24px rgba(99,102,241,0.4)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform  = 'translateY(0)';
                                    e.currentTarget.style.boxShadow  = '0 4px 16px rgba(99,102,241,0.3)';
                                }}
                            >
                                🎪 Create Expo
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Expos list ── */}
            <div style={s.listCard}>
                <div style={s.listHead}>
                    <span style={s.listTitle}>All Expos</span>
                    <span style={s.listCount}>{expos.length} total</span>
                </div>

                {loading ? (
                    <div style={s.stateText}>⏳ Loading expos...</div>
                ) : expos.length === 0 ? (
                    <div style={s.stateText}>📭 No expos found. Create your first expo!</div>
                ) : (
                    expos.map(expo => (
                        <div
                            key={expo._id}
                            style={s.expoRow}
                            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                            onMouseLeave={e => e.currentTarget.style.background = 'white'}
                        >
                            {/* Icon */}
                            <div style={s.expoIcon}>🎪</div>

                            {/* Info */}
                            <div style={s.expoInfo}>
                                <p style={s.expoTitle}>{expo.title}</p>
                                <p style={s.expoLoc}>📍 {expo.location}</p>
                                <p style={s.expoDates}>
                                    📅 {new Date(expo.startDate).toLocaleDateString()} — {new Date(expo.endDate).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div style={s.rowBtns}>
                                <button
                                    style={s.editBtn}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background   = 'rgba(99,102,241,0.15)';
                                        e.currentTarget.style.borderColor  = 'rgba(99,102,241,0.4)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background   = 'rgba(99,102,241,0.08)';
                                        e.currentTarget.style.borderColor  = 'rgba(99,102,241,0.25)';
                                    }}
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    style={s.deleteBtn}
                                    onClick={() => deleteExpo(expo._id)}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background   = 'rgba(239,68,68,0.15)';
                                        e.currentTarget.style.borderColor  = 'rgba(239,68,68,0.4)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background   = 'rgba(239,68,68,0.08)';
                                        e.currentTarget.style.borderColor  = 'rgba(239,68,68,0.25)';
                                    }}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ExposManagement;