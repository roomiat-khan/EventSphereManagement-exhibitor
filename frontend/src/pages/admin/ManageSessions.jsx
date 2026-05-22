import { useState, useEffect } from 'react';
import { getAllExposAdmin, getSessionsByExpo, createSession, updateSession, deleteSession } from '../../services/api';
import { toast } from 'react-toastify';

const ManageSessions = () => {
    const [expos, setExpos] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [selectedExpo, setSelectedExpo] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingSession, setEditingSession] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '',
        speaker: { name: '', bio: '' },
        topic: '', location: '',
        startTime: '', endTime: '',
        capacity: 100, type: 'talk', tags: ''
    });

    useEffect(() => { fetchExpos(); }, []);

    const fetchExpos = async () => {
        try {
            const res = await getAllExposAdmin();
            setExpos(res.data);
        } catch { toast.error('Failed to load expos'); }
    };

    const fetchSessions = async (expoId) => {
        setLoading(true);
        try {
            const res = await getSessionsByExpo(expoId);
            setSessions(res.data);
        } catch { toast.error('Failed to load sessions'); }
        finally { setLoading(false); }
    };

    const handleExpoChange = (e) => {
        setSelectedExpo(e.target.value);
        if (e.target.value) fetchSessions(e.target.value);
        else setSessions([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedExpo) return toast.error('Please select an expo first');
        try {
            const payload = {
                ...formData,
                expo: selectedExpo,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
            };
            if (editingSession) {
                await updateSession(editingSession._id, payload);
                toast.success('Session updated');
            } else {
                await createSession(payload);
                toast.success('Session created');
            }
            resetForm();
            fetchSessions(selectedExpo);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save session');
        }
    };

    const handleEdit = (session) => {
        setEditingSession(session);
        setFormData({
            title: session.title,
            description: session.description || '',
            speaker: { name: session.speaker?.name || '', bio: session.speaker?.bio || '' },
            topic: session.topic || '',
            location: session.location || '',
            startTime: session.startTime ? new Date(session.startTime).toISOString().slice(0, 16) : '',
            endTime: session.endTime ? new Date(session.endTime).toISOString().slice(0, 16) : '',
            capacity: session.capacity,
            type: session.type,
            tags: session.tags?.join(', ') || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this session?')) return;
        try {
            await deleteSession(id);
            toast.success('Session deleted');
            fetchSessions(selectedExpo);
        } catch { toast.error('Failed to delete session'); }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingSession(null);
        setFormData({
            title: '', description: '',
            speaker: { name: '', bio: '' },
            topic: '', location: '',
            startTime: '', endTime: '',
            capacity: 100, type: 'talk', tags: ''
        });
    };

    const typeStyle = (type) => ({
        talk:       { background: 'rgba(99,102,241,0.1)',  border: '1px solid rgba(99,102,241,0.3)',  color: '#6366f1' },
        workshop:   { background: 'rgba(16,185,129,0.1)',  border: '1px solid rgba(16,185,129,0.3)',  color: '#059669' },
        panel:      { background: 'rgba(139,92,246,0.1)',  border: '1px solid rgba(139,92,246,0.3)',  color: '#7c3aed' },
        keynote:    { background: 'rgba(245,158,11,0.1)',  border: '1px solid rgba(245,158,11,0.3)',  color: '#d97706' },
        networking: { background: 'rgba(236,72,153,0.1)',  border: '1px solid rgba(236,72,153,0.3)',  color: '#db2777' },
    }[type] || { background: 'rgba(148,163,184,0.1)', border: '1px solid #e2e8f0', color: '#64748b' });

    const focusInput = (e) => { e.target.style.border = '1.5px solid #6366f1'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; };
    const blurInput  = (e) => { e.target.style.border = '1.5px solid #e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; };

    const s = {
        // layout
        page: { fontFamily: "'Segoe UI', system-ui, sans-serif" },

        // header
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
        pageTitle: { fontSize: '22px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px', margin: 0 },
        headerRight: { display: 'flex', gap: '10px', flexWrap: 'wrap' },

        select: {
            padding: '10px 14px',
            border: '1.5px solid #e2e8f0', borderRadius: '10px',
            fontSize: '13px', color: '#0f172a',
            background: 'white', outline: 'none',
            cursor: 'pointer', fontWeight: '600',
            minWidth: '180px',
        },
        addBtn: (disabled) => ({
            padding: '10px 20px',
            background: disabled ? '#e2e8f0' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', borderRadius: '10px',
            color: disabled ? '#94a3b8' : 'white',
            fontSize: '13px', fontWeight: '700',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: disabled ? 'none' : '0 4px 12px rgba(99,102,241,0.3)',
            whiteSpace: 'nowrap',
        }),

        // empty / loading
        emptyBox: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '64px 32px', textAlign: 'center' },
        emptyIcon: { fontSize: '52px', marginBottom: '16px' },
        emptyText: { fontSize: '15px', color: '#94a3b8', fontWeight: '500', margin: '0 0 20px 0' },
        loadingBox: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', fontSize: '14px', color: '#94a3b8', fontWeight: '500' },

        // session list
        list: { display: 'flex', flexDirection: 'column', gap: '14px' },

        // session card
        card: {
            background: 'white', borderRadius: '18px',
            border: '1px solid #e2e8f0', padding: '20px 22px',
            transition: 'all 0.2s',
        },
        cardInner: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' },
        cardLeft: { flex: 1, minWidth: 0 },

        titleRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' },
        sessionTitle: { fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 },
        typePill: (type) => ({
            ...typeStyle(type),
            padding: '3px 10px', borderRadius: '100px',
            fontSize: '10px', fontWeight: '700',
            textTransform: 'capitalize', whiteSpace: 'nowrap',
        }),

        metaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px,1fr))', gap: '4px 16px', marginBottom: '10px' },
        metaItem: { fontSize: '12px', color: '#64748b', margin: 0, fontWeight: '500' },

        topic: { fontSize: '12px', color: '#6366f1', fontWeight: '600', margin: '6px 0' },

        tagRow: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' },
        tag: { background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '100px' },

        // capacity bar
        capWrap: { marginTop: '10px' },
        capLabel: { fontSize: '11px', color: '#94a3b8', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' },
        capBar: { height: '4px', background: '#f1f5f9', borderRadius: '100px', overflow: 'hidden' },

        // action col
        actionCol: { display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 },
        editBtn: { padding: '7px 14px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#6366f1', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' },
        deleteBtn: { padding: '7px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' },

        // modal
        overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px', backdropFilter: 'blur(4px)' },
        modal: { background: 'white', borderRadius: '24px', width: '100%', maxWidth: '620px', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' },
        modalHead: { padding: '20px 26px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 1 },
        modalTitle: { fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: 0 },
        closeBtn: { width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', cursor: 'pointer', color: '#64748b', transition: 'background 0.15s' },
        modalBody: { padding: '22px 26px' },

        label: { display: 'block', fontSize: '11px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' },
        mInput: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#0f172a', outline: 'none', transition: 'all 0.2s', background: '#f8fafc', boxSizing: 'border-box', marginBottom: '14px', fontFamily: 'inherit' },
        mTextarea: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#0f172a', outline: 'none', transition: 'all 0.2s', background: '#f8fafc', boxSizing: 'border-box', marginBottom: '14px', fontFamily: 'inherit', resize: 'vertical' },
        mSelect: { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', color: '#0f172a', outline: 'none', background: '#f8fafc', boxSizing: 'border-box', marginBottom: '14px', cursor: 'pointer' },
        grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
        modalBtnRow: { display: 'flex', gap: '10px', marginTop: '6px' },
        submitBtn: { flex: 1, padding: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' },
        cancelBtn: { flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '10px', color: '#475569', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'background 0.15s' },
    };

    return (
        <div style={s.page}>
            <style>{`
                @media (max-width: 640px) {
                    .session-card-inner { flex-direction: column !important; }
                    .session-action-col { flex-direction: row !important; }
                    .session-meta-grid { grid-template-columns: 1fr 1fr !important; }
                    .modal-grid2 { grid-template-columns: 1fr !important; }
                    .session-header { flex-direction: column; align-items: flex-start !important; }
                }
            `}</style>

            {/* Header */}
            <div style={s.header} className="session-header">
                <h2 style={s.pageTitle}>Manage Sessions</h2>
                <div style={s.headerRight}>
                    <select
                        value={selectedExpo}
                        onChange={handleExpoChange}
                        style={s.select}
                        onFocus={e => { e.target.style.border = '1.5px solid #6366f1'; }}
                        onBlur={e => { e.target.style.border = '1.5px solid #e2e8f0'; }}
                    >
                        <option value="">📋 Select Expo</option>
                        {expos.map(expo => (
                            <option key={expo._id} value={expo._id}>{expo.title}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => setShowForm(true)}
                        disabled={!selectedExpo}
                        style={s.addBtn(!selectedExpo)}
                        onMouseEnter={e => { if (selectedExpo) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(99,102,241,0.4)'; } }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = selectedExpo ? '0 4px 12px rgba(99,102,241,0.3)' : 'none'; }}
                    >
                        ＋ Add Session
                    </button>
                </div>
            </div>

            {/* Modal */}
            {showForm && (
                <div style={s.overlay}>
                    <div style={s.modal}>
                        <div style={s.modalHead}>
                            <h3 style={s.modalTitle}>{editingSession ? '✏️ Edit Session' : '📅 Create Session'}</h3>
                            <button style={s.closeBtn} onClick={resetForm}
                                onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                                onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                            >✕</button>
                        </div>
                        <div style={s.modalBody}>
                            <form onSubmit={handleSubmit}>
                                <label style={s.label}>Session Title</label>
                                <input type="text" value={formData.title} required
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. AI in Healthcare"
                                    style={s.mInput} onFocus={focusInput} onBlur={blurInput}
                                />

                                <label style={s.label}>Description</label>
                                <textarea rows={2} value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief session description"
                                    style={s.mTextarea} onFocus={focusInput} onBlur={blurInput}
                                />

                                <div style={s.grid2} className="modal-grid2">
                                    <div>
                                        <label style={s.label}>Speaker Name</label>
                                        <input type="text" value={formData.speaker.name} required
                                            onChange={e => setFormData({ ...formData, speaker: { ...formData.speaker, name: e.target.value } })}
                                            placeholder="Speaker name"
                                            style={s.mInput} onFocus={focusInput} onBlur={blurInput}
                                        />
                                    </div>
                                    <div>
                                        <label style={s.label}>Session Type</label>
                                        <select value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                            style={s.mSelect}
                                        >
                                            <option value="talk">🎙️ Talk</option>
                                            <option value="workshop">🛠️ Workshop</option>
                                            <option value="panel">👥 Panel</option>
                                            <option value="keynote">⭐ Keynote</option>
                                            <option value="networking">🤝 Networking</option>
                                        </select>
                                    </div>
                                </div>

                                <label style={s.label}>Speaker Bio</label>
                                <input type="text" value={formData.speaker.bio}
                                    onChange={e => setFormData({ ...formData, speaker: { ...formData.speaker, bio: e.target.value } })}
                                    placeholder="Short speaker bio"
                                    style={s.mInput} onFocus={focusInput} onBlur={blurInput}
                                />

                                <div style={s.grid2} className="modal-grid2">
                                    <div>
                                        <label style={s.label}>Topic</label>
                                        <input type="text" value={formData.topic}
                                            onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                            placeholder="Session topic"
                                            style={s.mInput} onFocus={focusInput} onBlur={blurInput}
                                        />
                                    </div>
                                    <div>
                                        <label style={s.label}>Location / Room</label>
                                        <input type="text" value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="Hall A, Room 2"
                                            style={s.mInput} onFocus={focusInput} onBlur={blurInput}
                                        />
                                    </div>
                                </div>

                                <div style={s.grid2} className="modal-grid2">
                                    <div>
                                        <label style={s.label}>Start Time</label>
                                        <input type="datetime-local" value={formData.startTime} required
                                            onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                            style={s.mInput} onFocus={focusInput} onBlur={blurInput}
                                        />
                                    </div>
                                    <div>
                                        <label style={s.label}>End Time</label>
                                        <input type="datetime-local" value={formData.endTime} required
                                            onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                            style={s.mInput} onFocus={focusInput} onBlur={blurInput}
                                        />
                                    </div>
                                </div>

                                <div style={s.grid2} className="modal-grid2">
                                    <div>
                                        <label style={s.label}>Capacity</label>
                                        <input type="number" value={formData.capacity}
                                            onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                                            style={s.mInput} onFocus={focusInput} onBlur={blurInput}
                                        />
                                    </div>
                                    <div>
                                        <label style={s.label}>Tags <span style={{ color: '#94a3b8', fontWeight: '400', textTransform: 'none' }}>(comma separated)</span></label>
                                        <input type="text" value={formData.tags}
                                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                            placeholder="AI, Cloud, Web3"
                                            style={s.mInput} onFocus={focusInput} onBlur={blurInput}
                                        />
                                    </div>
                                </div>

                                <div style={s.modalBtnRow}>
                                    <button type="submit" style={s.submitBtn}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(99,102,241,0.4)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.3)'; }}
                                    >
                                        {editingSession ? 'Update Session' : 'Create Session'}
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

            {/* Content */}
            {!selectedExpo ? (
                <div style={s.emptyBox}>
                    <div style={s.emptyIcon}>📅</div>
                    <p style={s.emptyText}>Select an expo above to manage its sessions.</p>
                </div>
            ) : loading ? (
                <div style={s.loadingBox}>⏳ Loading sessions...</div>
            ) : sessions.length === 0 ? (
                <div style={s.emptyBox}>
                    <div style={s.emptyIcon}>📭</div>
                    <p style={s.emptyText}>No sessions yet for this expo.</p>
                    <button style={s.addBtn(false)} onClick={() => setShowForm(true)}>
                        ＋ Create First Session
                    </button>
                </div>
            ) : (
                <div style={s.list}>
                    {sessions.map(session => {
                        const pct = Math.round((session.registeredCount / session.capacity) * 100);
                        const barColor = pct >= 90 ? '#ef4444' : pct >= 60 ? '#f59e0b' : '#10b981';
                        return (
                            <div
                                key={session._id} style={s.card}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#6366f1'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                            >
                                <div style={s.cardInner} className="session-card-inner">
                                    <div style={s.cardLeft}>
                                        {/* Title + type */}
                                        <div style={s.titleRow}>
                                            <h3 style={s.sessionTitle}>{session.title}</h3>
                                            <span style={s.typePill(session.type)}>{session.type}</span>
                                        </div>

                                        {/* Meta */}
                                        <div style={s.metaGrid} className="session-meta-grid">
                                            <p style={s.metaItem}>🎤 {session.speaker?.name}</p>
                                            <p style={s.metaItem}>📍 {session.location || 'TBD'}</p>
                                            <p style={s.metaItem}>🕐 {new Date(session.startTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                            <p style={s.metaItem}>⏱️ ends {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>

                                        {/* Topic */}
                                        {session.topic && <p style={s.topic}>💡 {session.topic}</p>}

                                        {/* Tags */}
                                        {session.tags?.length > 0 && (
                                            <div style={s.tagRow}>
                                                {session.tags.map((tag, i) => (
                                                    <span key={i} style={s.tag}>#{tag}</span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Capacity bar */}
                                        <div style={s.capWrap}>
                                            <div style={s.capLabel}>
                                                <span>Capacity</span>
                                                <span style={{ fontWeight: '700', color: barColor }}>{session.registeredCount}/{session.capacity} ({pct}%)</span>
                                            </div>
                                            <div style={s.capBar}>
                                                <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: '100px', transition: 'width 0.5s' }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div style={s.actionCol} className="session-action-col">
                                        <button style={s.editBtn} onClick={() => handleEdit(session)}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.borderColor = '#6366f1'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; }}
                                        >✏️ Edit</button>
                                        <button style={s.deleteBtn} onClick={() => handleDelete(session._id)}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor = '#ef4444'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
                                        >🗑️ Delete</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ManageSessions;