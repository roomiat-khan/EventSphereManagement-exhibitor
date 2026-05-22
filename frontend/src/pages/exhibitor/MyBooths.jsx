import { useState, useEffect } from 'react';
import { getMyApplications } from '../../services/api';
import { toast } from 'react-toastify';

const MyBooths = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchApplications(); }, []);

    const fetchApplications = async () => {
        try {
            const res = await getMyApplications();
            setApplications(res.data);
        } catch (error) {
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="mb-loading">⏳ Loading applications...</div>;

    return (
        <>
            <style>{`
                .mb-loading {
                    display: flex; align-items: center; justify-content: center;
                    padding: 60px; font-size: 14px;
                    color: #94a3b8; font-weight: 500;
                }

                /* ── header ── */
                .mb-header { margin-bottom: 24px; }
                .mb-title {
                    font-size: 22px; font-weight: 900;
                    color: #0f172a; letter-spacing: -0.5px; margin: 0;
                }
                .mb-sub { font-size: 13px; color: #94a3b8; margin-top: 4px; }

                /* ── empty ── */
                .mb-empty {
                    background: white; border-radius: 20px;
                    border: 1px solid #e2e8f0;
                    padding: 64px 32px; text-align: center;
                }
                .mb-empty-icon  { font-size: 52px; margin-bottom: 16px; }
                .mb-empty-title { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0; }
                .mb-empty-desc  { font-size: 13px; color: #94a3b8; margin: 0; }

                /* ── list ── */
                .mb-list { display: flex; flex-direction: column; gap: 16px; }

                /* ── card ── */
                .mb-card {
                    background: white; border-radius: 20px;
                    border: 1px solid #e2e8f0;
                    padding: 24px; transition: all 0.2s;
                }
                .mb-card:hover {
                    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
                    border-color: #6366f1;
                }

                /* card top row */
                .mb-card-top {
                    display: flex; justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 16px; gap: 12px;
                }
                .mb-company {
                    font-size: 16px; font-weight: 800;
                    color: #0f172a; margin: 0 0 4px 0;
                }
                .mb-expo-name { font-size: 13px; color: #64748b; margin: 0 0 2px 0; }
                .mb-expo-meta { font-size: 13px; color: #94a3b8; margin: 0; }

                /* status badge */
                .mb-badge {
                    padding: 4px 12px; border-radius: 100px;
                    font-size: 11px; font-weight: 700;
                    text-transform: capitalize; white-space: nowrap;
                    flex-shrink: 0;
                }
                .mb-badge-pending  { background: rgba(245,158,11,0.1);  border: 1px solid rgba(245,158,11,0.3);  color: #d97706; }
                .mb-badge-approved { background: rgba(16,185,129,0.1);  border: 1px solid rgba(16,185,129,0.3);  color: #059669; }
                .mb-badge-rejected { background: rgba(239,68,68,0.1);   border: 1px solid rgba(239,68,68,0.3);   color: #dc2626; }
                .mb-badge-default  { background: rgba(148,163,184,0.1); border: 1px solid #e2e8f0;               color: #64748b; }

                /* booth status boxes */
                .mb-booth-box {
                    border-radius: 12px; padding: 14px 16px;
                }
                .mb-booth-assigned { background: rgba(16,185,129,0.06);  border: 1px solid rgba(16,185,129,0.25); }
                .mb-booth-approved { background: rgba(99,102,241,0.06);  border: 1px solid rgba(99,102,241,0.25); }
                .mb-booth-rejected { background: rgba(239,68,68,0.06);   border: 1px solid rgba(239,68,68,0.25);  }
                .mb-booth-pending  { background: rgba(245,158,11,0.06);  border: 1px solid rgba(245,158,11,0.25); }

                .mb-booth-label { font-size: 13px; font-weight: 700; margin: 0 0 4px 0; }
                .mb-booth-label-assigned { color: #059669; }
                .mb-booth-label-approved { color: #6366f1; }
                .mb-booth-label-rejected { color: #dc2626; }
                .mb-booth-label-pending  { color: #d97706; }

                .mb-booth-detail { font-size: 13px; color: #475569; margin: 0; }
                .mb-booth-detail b { color: #0f172a; }

                /* booth detail pills row */
                .mb-booth-pills {
                    display: flex; flex-wrap: wrap;
                    gap: 8px; margin-top: 6px;
                }
                .mb-booth-pill {
                    background: rgba(16,185,129,0.08);
                    border: 1px solid rgba(16,185,129,0.2);
                    border-radius: 100px;
                    padding: 3px 10px;
                    font-size: 12px; font-weight: 600; color: #059669;
                }

                .mb-rejection-reason { font-size: 13px; color: #ef4444; margin: 6px 0 0 0; }

                /* product tags */
                .mb-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
                .mb-tag {
                    background: #f1f5f9; border: 1px solid #e2e8f0;
                    color: #475569; font-size: 11px; font-weight: 600;
                    padding: 4px 12px; border-radius: 100px;
                }

                /* ── RESPONSIVE ── */
                @media (max-width: 640px) {
                    .mb-title  { font-size: 18px; }
                    .mb-header { margin-bottom: 16px; }

                    .mb-card   { padding: 16px; border-radius: 16px; }

                    /* stack status badge below company name on small screens */
                    .mb-card-top { flex-direction: column; gap: 8px; }
                    .mb-badge    { align-self: flex-start; }

                    .mb-company  { font-size: 15px; }

                    .mb-booth-box { padding: 12px 14px; }
                    .mb-booth-detail { font-size: 12px; }

                    /* booth pills vertical on very small */
                    .mb-booth-pills { gap: 6px; }
                    .mb-booth-pill  { font-size: 11px; }

                    .mb-empty { padding: 40px 20px; }
                }

                @media (max-width: 400px) {
                    .mb-card { padding: 14px; }
                    .mb-expo-meta { font-size: 12px; }
                }
            `}</style>

            <div>
                <div className="mb-header">
                    <h2 className="mb-title">My Applications & Booths</h2>
                    <p className="mb-sub">Track your expo applications and assigned booth details</p>
                </div>

                {applications.length === 0 ? (
                    <div className="mb-empty">
                        <div className="mb-empty-icon">🏢</div>
                        <p className="mb-empty-title">No applications yet</p>
                        <p className="mb-empty-desc">Apply for an expo to get started.</p>
                    </div>
                ) : (
                    <div className="mb-list">
                        {applications.map(app => {
                            const status = app.applicationStatus;
                            const badgeClass = ['pending','approved','rejected'].includes(status)
                                ? `mb-badge mb-badge-${status}`
                                : 'mb-badge mb-badge-default';

                            return (
                                <div key={app._id} className="mb-card">

                                    {/* Top row */}
                                    <div className="mb-card-top">
                                        <div>
                                            <h3 className="mb-company">{app.companyName}</h3>
                                            <p className="mb-expo-name">
                                                Expo: <strong>{app.expo?.title}</strong>
                                            </p>
                                            <p className="mb-expo-meta">
                                                📍 {app.expo?.location} &nbsp;|&nbsp;
                                                📅 {new Date(app.expo?.startDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={badgeClass}>{status}</span>
                                    </div>

                                    {/* Booth status box */}
                                    {app.booth ? (
                                        <div className="mb-booth-box mb-booth-assigned">
                                            <p className="mb-booth-label mb-booth-label-assigned">✅ Booth Assigned</p>
                                            <div className="mb-booth-pills">
                                                <span className="mb-booth-pill">#{app.booth.boothNumber}</span>
                                                <span className="mb-booth-pill" style={{ textTransform: 'capitalize' }}>{app.booth.size}</span>
                                                <span className="mb-booth-pill">${app.booth.price}</span>
                                            </div>
                                        </div>
                                    ) : status === 'approved' ? (
                                        <div className="mb-booth-box mb-booth-approved">
                                            <p className="mb-booth-label mb-booth-label-approved" style={{ margin: 0 }}>
                                                ✅ Approved — Booth will be assigned by the organizer soon.
                                            </p>
                                        </div>
                                    ) : status === 'rejected' ? (
                                        <div className="mb-booth-box mb-booth-rejected">
                                            <p className="mb-booth-label mb-booth-label-rejected" style={{ margin: 0 }}>❌ Application Rejected</p>
                                            {app.rejectionReason && (
                                                <p className="mb-rejection-reason">Reason: {app.rejectionReason}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="mb-booth-box mb-booth-pending">
                                            <p className="mb-booth-label mb-booth-label-pending" style={{ margin: 0 }}>⏳ Pending admin review.</p>
                                        </div>
                                    )}

                                    {/* Product tags */}
                                    {app.products?.length > 0 && (
                                        <div className="mb-tags">
                                            {app.products.map((p, i) => (
                                                <span key={i} className="mb-tag">{p}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyBooths;