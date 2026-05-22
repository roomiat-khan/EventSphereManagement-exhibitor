import { useState, useEffect } from 'react';
import { submitFeedback, getMyFeedback, getExpos } from '../../services/api';
import { toast } from 'react-toastify';

const Feedback = () => {
    const [expos, setExpos] = useState([]);
    const [myFeedbacks, setMyFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeView, setActiveView] = useState('form'); // 'form' | 'history'
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [formData, setFormData] = useState({
        type: 'general', subject: '', message: '', expo: ''
    });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [exposRes, feedbackRes] = await Promise.all([
                getExpos(),
                getMyFeedback()
            ]);
            setExpos(exposRes.data);
            setMyFeedbacks(feedbackRes.data);
        } catch { toast.error('Failed to load data'); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.subject.trim() || !formData.message.trim()) {
            return toast.error('Please fill in all required fields');
        }
        setSubmitting(true);
        try {
            await submitFeedback({ ...formData, rating: rating || null });
            toast.success('Feedback submitted! Thank you 🙏');
            setFormData({ type: 'general', subject: '', message: '', expo: '' });
            setRating(0);
            fetchData();
            setActiveView('history');
        } catch { toast.error('Failed to submit feedback'); }
        finally { setSubmitting(false); }
    };

    const typeConfig = {
        general:    { icon: '💬', color: '#6366f1', label: 'General'    },
        bug:        { icon: '🐛', color: '#ef4444', label: 'Bug Report'  },
        suggestion: { icon: '💡', color: '#f59e0b', label: 'Suggestion'  },
        complaint:  { icon: '😤', color: '#f97316', label: 'Complaint'   },
        compliment: { icon: '🌟', color: '#10b981', label: 'Compliment'  },
    };

    const statusConfig = {
        pending:  { bg: 'rgba(245,158,11,0.1)',  color: '#d97706', label: 'Pending'  },
        reviewed: { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1', label: 'Reviewed' },
        resolved: { bg: 'rgba(16,185,129,0.1)',  color: '#059669', label: 'Resolved' },
    };

    const s = {
        page: { fontFamily: "'Segoe UI',system-ui,sans-serif" },
        header: { marginBottom: '24px' },
        title: { fontSize: '22px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px', margin: '0 0 4px 0' },
        subtitle: { fontSize: '13px', color: '#94a3b8', margin: 0 },

        // Tabs
        tabRow: { display: 'flex', gap: '8px', marginBottom: '24px' },
        tab: (active) => ({
            padding: '9px 20px', borderRadius: '10px', border: 'none',
            fontSize: '13px', fontWeight: '700', cursor: 'pointer',
            transition: 'all 0.15s',
            background: active ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'white',
            color: active ? 'white' : '#64748b',
            boxShadow: active ? '0 4px 12px rgba(99,102,241,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
            border: active ? 'none' : '1px solid #e2e8f0',
        }),

        // Form card
        formCard: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' },
        formHead: { padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: 'linear-gradient(135deg,#0f172a,#1e1b4b)', position: 'relative', overflow: 'hidden' },
        formHeadBg: { position: 'absolute', inset: 0, backgroundImage: `radial-gradient(ellipse at 80% 50%, rgba(99,102,241,0.2) 0%, transparent 60%)` },
        formHeadContent: { position: 'relative', zIndex: 1 },
        formHeadTitle: { fontSize: '16px', fontWeight: '800', color: 'white', margin: '0 0 4px 0' },
        formHeadSub: { fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 },
        formBody: { padding: '24px' },

        label: { display: 'block', fontSize: '11px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' },
        input: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#0f172a', outline: 'none', transition: 'all 0.2s', background: '#f8fafc', boxSizing: 'border-box', marginBottom: '16px', fontFamily: 'inherit' },
        textarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#0f172a', outline: 'none', transition: 'all 0.2s', background: '#f8fafc', boxSizing: 'border-box', marginBottom: '16px', fontFamily: 'inherit', resize: 'vertical' },
        select: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#0f172a', outline: 'none', background: '#f8fafc', boxSizing: 'border-box', marginBottom: '16px', cursor: 'pointer' },
        grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },

        // Type selector
        typeGrid: { display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '8px', marginBottom: '16px' },
        typeBtn: (active, type) => ({
            padding: '10px 6px', borderRadius: '10px', border: 'none',
            cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
            background: active ? `${typeConfig[type].color}15` : '#f8fafc',
            border: active ? `1.5px solid ${typeConfig[type].color}40` : '1.5px solid #e2e8f0',
        }),
        typeBtnIcon: { fontSize: '20px', display: 'block', marginBottom: '4px' },
        typeBtnLabel: (active, type) => ({ fontSize: '10px', fontWeight: '700', color: active ? typeConfig[type].color : '#94a3b8' }),

        // Star rating
        starRow: { display: 'flex', gap: '6px', marginBottom: '16px' },
        star: (filled) => ({ fontSize: '28px', cursor: 'pointer', transition: 'all 0.1s', color: filled ? '#f59e0b' : '#e2e8f0', filter: filled ? 'drop-shadow(0 0 4px rgba(245,158,11,0.4))' : 'none' }),

        // Submit btn
        submitBtn: { width: '100%', padding: '13px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(99,102,241,0.3)', marginTop: '4px' },

        // History
        historyList: { display: 'flex', flexDirection: 'column', gap: '12px' },
        historyCard: { background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px 20px', transition: 'all 0.2s' },
        historyTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
        historySubject: { fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '0 0 3px 0' },
        historyMeta: { fontSize: '12px', color: '#94a3b8' },
        historyMsg: { fontSize: '13px', color: '#64748b', lineHeight: '1.6', margin: '0 0 12px 0' },
        historyBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        typePill: (type) => ({ background: `${typeConfig[type]?.color}15`, color: typeConfig[type]?.color, padding: '3px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }),
        statusPill: (status) => ({ background: statusConfig[status]?.bg, color: statusConfig[status]?.color, padding: '3px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: '700' }),

        empty: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '60px 32px', textAlign: 'center' },
        emptyIcon: { fontSize: '48px', marginBottom: '16px' },
        emptyText: { fontSize: '15px', color: '#94a3b8', fontWeight: '500', margin: 0 },

        loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px' },
    };

    const focusInput = (e) => { e.target.style.border = '1.5px solid #6366f1'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; };
    const blurInput  = (e) => { e.target.style.border = '1.5px solid #e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; };

    if (loading) return (
        <div style={s.loading}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Loading...</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div style={s.page}>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 640px) {
                    .fb-grid2 { grid-template-columns: 1fr !important; }
                    .fb-type-grid { grid-template-columns: repeat(3,1fr) !important; }
                }
            `}</style>

            {/* Header */}
            <div style={s.header}>
                <h2 style={s.title}>💬 Feedback</h2>
                <p style={s.subtitle}>Share your experience or report an issue</p>
            </div>

            {/* Tabs */}
            <div style={s.tabRow}>
                <button style={s.tab(activeView === 'form')} onClick={() => setActiveView('form')}>
                    ✍️ Submit Feedback
                </button>
                <button style={s.tab(activeView === 'history')} onClick={() => setActiveView('history')}>
                    📋 My History ({myFeedbacks.length})
                </button>
            </div>

            {/* FORM VIEW */}
            {activeView === 'form' && (
                <div style={s.formCard}>
                    <div style={s.formHead}>
                        <div style={s.formHeadBg} />
                        <div style={s.formHeadContent}>
                            <h3 style={s.formHeadTitle}>Share Your Feedback</h3>
                            <p style={s.formHeadSub}>Your feedback helps us improve EventSphere for everyone</p>
                        </div>
                    </div>
                    <div style={s.formBody}>
                        <form onSubmit={handleSubmit}>

                            {/* Type Selector */}
                            <label style={s.label}>Feedback Type</label>
                            <div style={s.typeGrid} className="fb-type-grid">
                                {Object.entries(typeConfig).map(([key, val]) => (
                                    <button key={key} type="button"
                                        style={s.typeBtn(formData.type === key, key)}
                                        onClick={() => setFormData({ ...formData, type: key })}
                                    >
                                        <span style={s.typeBtnIcon}>{val.icon}</span>
                                        <span style={s.typeBtnLabel(formData.type === key, key)}>{val.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Expo + Subject */}
                            <div style={s.grid2} className="fb-grid2">
                                <div>
                                    <label style={s.label}>Related Expo <span style={{ color: '#94a3b8', textTransform: 'none', fontWeight: '400' }}>(optional)</span></label>
                                    <select value={formData.expo}
                                        onChange={e => setFormData({ ...formData, expo: e.target.value })}
                                        style={s.select}
                                    >
                                        <option value="">No specific expo</option>
                                        {expos.map(expo => (
                                            <option key={expo._id} value={expo._id}>{expo.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={s.label}>Subject *</label>
                                    <input type="text" value={formData.subject} required
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="Brief summary..."
                                        style={s.input} onFocus={focusInput} onBlur={blurInput}
                                    />
                                </div>
                            </div>

                            {/* Message */}
                            <label style={s.label}>Message *</label>
                            <textarea value={formData.message} required rows={5}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Describe your feedback in detail..."
                                style={s.textarea} onFocus={focusInput} onBlur={blurInput}
                            />

                            {/* Star Rating */}
                            <label style={s.label}>Overall Rating <span style={{ color: '#94a3b8', textTransform: 'none', fontWeight: '400' }}>(optional)</span></label>
                            <div style={s.starRow}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span key={star}
                                        style={s.star(star <= (hoverRating || rating))}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >★</span>
                                ))}
                                {rating > 0 && (
                                    <span style={{ fontSize: '13px', color: '#f59e0b', fontWeight: '700', alignSelf: 'center', marginLeft: '8px' }}>
                                        {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                                    </span>
                                )}
                            </div>

                            <button type="submit" disabled={submitting} style={{ ...s.submitBtn, opacity: submitting ? 0.7 : 1 }}
                                onMouseEnter={e => { if (!submitting) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.4)'; } }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.3)'; }}
                            >
                                {submitting ? '⏳ Submitting...' : '🚀 Submit Feedback'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* HISTORY VIEW */}
            {activeView === 'history' && (
                myFeedbacks.length === 0 ? (
                    <div style={s.empty}>
                        <div style={s.emptyIcon}>💬</div>
                        <p style={s.emptyText}>No feedback submitted yet</p>
                    </div>
                ) : (
                    <div style={s.historyList}>
                        {myFeedbacks.map((fb, i) => (
                            <div key={fb._id} style={s.historyCard}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#6366f1'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                            >
                                <div style={s.historyTop}>
                                    <div>
                                        <h4 style={s.historySubject}>{fb.subject}</h4>
                                        <p style={s.historyMeta}>
                                            {fb.expo?.title && `🎪 ${fb.expo.title} · `}
                                            📅 {new Date(fb.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <span style={s.statusPill(fb.status)}>{statusConfig[fb.status]?.label}</span>
                                </div>

                                <p style={s.historyMsg}>{fb.message}</p>

                                <div style={s.historyBottom}>
                                    <span style={s.typePill(fb.type)}>
                                        {typeConfig[fb.type]?.icon} {typeConfig[fb.type]?.label}
                                    </span>
                                    {fb.rating && (
                                        <span style={{ fontSize: '13px', color: '#f59e0b', fontWeight: '700' }}>
                                            {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default Feedback;