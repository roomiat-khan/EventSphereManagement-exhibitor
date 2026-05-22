import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ExhibitorManagement = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchApplications(); }, []);

    const fetchApplications = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/exhibitors/applications', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setApplications(res.data);
        } catch (error) {
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(
                `http://localhost:5000/api/exhibitors/applications/${id}`,
                { status },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            toast.success(`Application ${status}`);
            fetchApplications();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const statusStyle = (status) => {
        const map = {
            approved : { background: 'rgba(16,185,129,0.1)',  border: '1px solid rgba(16,185,129,0.3)',  color: '#059669' },
            rejected : { background: 'rgba(239,68,68,0.1)',   border: '1px solid rgba(239,68,68,0.3)',   color: '#dc2626' },
            pending  : { background: 'rgba(245,158,11,0.1)',  border: '1px solid rgba(245,158,11,0.3)',  color: '#d97706' },
        };
        return map[status] || { background: 'rgba(148,163,184,0.1)', border: '1px solid #e2e8f0', color: '#64748b' };
    };

    /* ── styles ─────────────────────────────────────────────── */
    const s = {
        loading: {
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '60px', fontSize: '14px', color: '#94a3b8', fontWeight: '500',
        },

        /* header */
        pageTitle: { fontSize: '22px', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.5px', margin: '0 0 24px 0' },

        /* table card */
        tableCard: {
            background: 'white', borderRadius: '20px',
            border: '1px solid #e2e8f0', overflow: 'hidden',
        },
        tableHead: {
            padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        },
        tableTitle: { fontSize: '15px', fontWeight: '800', color: '#0f172a' },
        tableCount: { fontSize: '12px', color: '#94a3b8' },

        /* empty */
        empty: {
            padding: '60px 32px', textAlign: 'center',
            fontSize: '14px', color: '#94a3b8', fontWeight: '500',
        },

        tableWrap: { overflowX: 'auto' },
        table: { width: '100%', borderCollapse: 'collapse' },
        th: {
            textAlign: 'left', padding: '11px 20px',
            fontSize: '10px', fontWeight: '700', color: '#94a3b8',
            textTransform: 'uppercase', letterSpacing: '0.06em',
            background: '#f8fafc', borderBottom: '1px solid #f1f5f9',
            whiteSpace: 'nowrap',
        },
        thCenter: {
            textAlign: 'center', padding: '11px 20px',
            fontSize: '10px', fontWeight: '700', color: '#94a3b8',
            textTransform: 'uppercase', letterSpacing: '0.06em',
            background: '#f8fafc', borderBottom: '1px solid #f1f5f9',
        },
        td: {
            padding: '14px 20px',
            borderBottom: '1px solid #f8fafc',
            fontSize: '13px', color: '#475569',
            verticalAlign: 'middle',
        },
        tdCenter: {
            padding: '14px 20px',
            borderBottom: '1px solid #f8fafc',
            fontSize: '13px', color: '#475569',
            verticalAlign: 'middle',
            textAlign: 'center',
        },
        companyName: { fontSize: '14px', fontWeight: '700', color: '#0f172a' },

        /* status pill */
        statusPill: (status) => ({
            ...statusStyle(status),
            padding: '3px 10px', borderRadius: '100px',
            fontSize: '10px', fontWeight: '700',
            textTransform: 'capitalize', display: 'inline-block',
        }),

        /* action buttons */
        actionWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
        approveBtn: {
            padding: '6px 14px',
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.3)',
            color: '#059669', borderRadius: '8px',
            fontSize: '12px', fontWeight: '700',
            cursor: 'pointer', transition: 'all 0.15s',
        },
        rejectBtn: {
            padding: '6px 14px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#dc2626', borderRadius: '8px',
            fontSize: '12px', fontWeight: '700',
            cursor: 'pointer', transition: 'all 0.15s',
        },
    };

    if (loading) return <div style={s.loading}>⏳ Loading applications...</div>;

    /* counts for header */
    const pending  = applications.filter(a => a.status === 'pending').length;

    return (
        <div>
            <h1 style={s.pageTitle}>Exhibitor Applications</h1>

            <div style={s.tableCard}>
                {/* Card header */}
                <div style={s.tableHead}>
                    <span style={s.tableTitle}>All Applications</span>
                    <span style={s.tableCount}>
                        {applications.length} total
                        {pending > 0 && (
                            <span style={{
                                marginLeft: '8px', padding: '2px 8px',
                                background: 'rgba(245,158,11,0.1)',
                                border: '1px solid rgba(245,158,11,0.3)',
                                color: '#d97706', borderRadius: '100px',
                                fontSize: '11px', fontWeight: '700',
                            }}>
                                {pending} pending
                            </span>
                        )}
                    </span>
                </div>

                {applications.length === 0 ? (
                    <div style={s.empty}>📭 No applications found.</div>
                ) : (
                    <div style={s.tableWrap}>
                        <table style={s.table}>
                            <thead>
                                <tr>
                                    <th style={s.th}>Company</th>
                                    <th style={s.th}>Applicant</th>
                                    <th style={s.th}>Expo</th>
                                    <th style={s.th}>Status</th>
                                    <th style={s.thCenter}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map(app => (
                                    <tr
                                        key={app._id}
                                        style={{ background: 'white', transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                    >
                                        {/* Company */}
                                        <td style={s.td}>
                                            <span style={s.companyName}>{app.companyName}</span>
                                        </td>

                                        {/* Applicant */}
                                        <td style={s.td}>{app.user?.name}</td>

                                        {/* Expo */}
                                        <td style={s.td}>{app.expo?.title}</td>

                                        {/* Status */}
                                        <td style={s.td}>
                                            <span style={s.statusPill(app.status)}>{app.status}</span>
                                        </td>

                                        {/* Actions */}
                                        <td style={s.tdCenter}>
                                            {app.status === 'pending' ? (
                                                <div style={s.actionWrap}>
                                                    <button
                                                        style={s.approveBtn}
                                                        onClick={() => handleStatusUpdate(app._id, 'approved')}
                                                        onMouseEnter={e => {
                                                            e.currentTarget.style.background = 'rgba(16,185,129,0.2)';
                                                            e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)';
                                                        }}
                                                        onMouseLeave={e => {
                                                            e.currentTarget.style.background = 'rgba(16,185,129,0.1)';
                                                            e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)';
                                                        }}
                                                    >
                                                        ✅ Approve
                                                    </button>
                                                    <button
                                                        style={s.rejectBtn}
                                                        onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                                        onMouseEnter={e => {
                                                            e.currentTarget.style.background = 'rgba(239,68,68,0.2)';
                                                            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)';
                                                        }}
                                                        onMouseLeave={e => {
                                                            e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
                                                            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
                                                        }}
                                                    >
                                                        ❌ Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExhibitorManagement;