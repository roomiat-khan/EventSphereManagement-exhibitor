// import { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getExhibitorStats } from '../../services/api';
// import { AuthContext } from '../../context/AuthContext';
// import { toast } from 'react-toastify';

// const ExhibitorOverview = ({ setActiveTab }) => {
//     const { user } = useContext(AuthContext);
//     const navigate = useNavigate();
//     const [stats, setStats] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => { fetchStats(); }, []);

//     const fetchStats = async () => {
//         try {
//             const res = await getExhibitorStats();
//             setStats(res.data);
//         } catch (err) {
//             toast.error('Failed to load stats');
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) return (
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '12px' }}>
//             <div style={{ width: '36px', height: '36px', border: '3px solid #10b981', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
//             <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>Loading dashboard...</span>
//             <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//         </div>
//     );

//     const statusStyle = (status) => ({
//         pending:  { bg: 'rgba(245,158,11,0.1)',  color: '#d97706', border: 'rgba(245,158,11,0.3)'  },
//         approved: { bg: 'rgba(16,185,129,0.1)',  color: '#059669', border: 'rgba(16,185,129,0.3)'  },
//         rejected: { bg: 'rgba(239,68,68,0.1)',   color: '#dc2626', border: 'rgba(239,68,68,0.3)'   },
//     }[status] || { bg: 'rgba(148,163,184,0.1)', color: '#64748b', border: '#e2e8f0' });

//     const expoStatusStyle = (status) => ({
//         published: { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1' },
//         ongoing:   { bg: 'rgba(16,185,129,0.1)',  color: '#059669' },
//         draft:     { bg: 'rgba(148,163,184,0.1)', color: '#64748b' },
//         completed: { bg: 'rgba(139,92,246,0.1)',  color: '#7c3aed' },
//         cancelled: { bg: 'rgba(239,68,68,0.1)',   color: '#dc2626' },
//     }[status] || { bg: 'rgba(148,163,184,0.1)', color: '#64748b' });

//     const daysLeft = (deadline) => {
//         if (!deadline) return null;
//         return Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
//     };

//     const s = {
//         page: { fontFamily: "'Segoe UI',system-ui,sans-serif" },

//         // Banner
//         banner: { background: 'linear-gradient(135deg,#0f172a,#064e3b)', borderRadius: '20px', padding: '28px 32px', marginBottom: '24px', position: 'relative', overflow: 'hidden' },
//         bannerBg: { position: 'absolute', inset: 0, backgroundImage: `radial-gradient(ellipse at 80% 50%, rgba(16,185,129,0.2) 0%, transparent 60%)` },
//         bannerContent: { position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' },
//         bannerLeft: {},
//         bannerBadge: { display: 'inline-block', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', color: '#6ee7b7', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '100px', marginBottom: '10px', letterSpacing: '0.05em' },
//         bannerTitle: { fontSize: '20px', fontWeight: '900', color: 'white', margin: '0 0 4px 0', letterSpacing: '-0.5px' },
//         bannerSub: { fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0 },
//         applyBtn: { padding: '12px 24px', background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 16px rgba(16,185,129,0.3)', transition: 'all 0.2s', whiteSpace: 'nowrap' },

//         // KPI
//         kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' },
//         kpiCard: { background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '16px' },
//         kpiIcon: { width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 },
//         kpiVal: { fontSize: '28px', fontWeight: '900', color: '#0f172a', lineHeight: '1' },
//         kpiLabel: { fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '3px' },

//         // Cards
//         card: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '20px' },
//         cardHead: { padding: '18px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
//         cardTitle: { fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: 0 },
//         viewAllBtn: { fontSize: '12px', fontWeight: '700', color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 10px', borderRadius: '6px', transition: 'background 0.15s' },

//         // App row
//         appRow: { padding: '16px 22px', borderBottom: '1px solid #f8fafc', transition: 'background 0.15s', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' },
//         appCompany: { fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' },
//         appMeta: { fontSize: '12px', color: '#64748b' },
//         statusPill: (status) => ({ background: statusStyle(status).bg, color: statusStyle(status).color, border: `1px solid ${statusStyle(status).border}`, padding: '3px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: '700', textTransform: 'capitalize', whiteSpace: 'nowrap', flexShrink: 0 }),
//         expoStatusPill: (status) => ({ background: expoStatusStyle(status).bg, color: expoStatusStyle(status).color, padding: '3px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: '700', textTransform: 'capitalize', whiteSpace: 'nowrap' }),

//         // Deadline badge
//         deadlineBadge: (days) => ({
//             display: 'inline-flex', alignItems: 'center', gap: '4px',
//             padding: '3px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: '700',
//             background: days <= 3 ? 'rgba(239,68,68,0.1)' : days <= 7 ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
//             color: days <= 3 ? '#dc2626' : days <= 7 ? '#d97706' : '#059669',
//         }),

//         // Quick actions
//         quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', padding: '16px 20px' },
//         quickBtn: { padding: '18px', borderRadius: '16px', border: '1.5px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' },
//         quickIcon: { fontSize: '24px', marginBottom: '10px', display: 'block' },
//         quickLabel: { fontSize: '13px', fontWeight: '700', color: '#0f172a', display: 'block' },
//         quickDesc: { fontSize: '11px', color: '#94a3b8', marginTop: '3px' },

//         // Empty
//         empty: { textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '13px' },
//         emptyIcon: { fontSize: '32px', marginBottom: '8px' },
//     };

//     const quickActions = [
//         { label: 'Apply for Expo', icon: '📋', desc: 'Submit a new application', tab: 'apply',   path: '/exhibitor/apply',   color: '#10b981' },
//         { label: 'My Booths',      icon: '🏢', desc: 'View booth assignments',   tab: 'booths',  path: '/exhibitor/booths',  color: '#6366f1' },
//         { label: 'My Profile',     icon: '👤', desc: 'Update company details',   tab: 'profile', path: '/exhibitor/profile', color: '#f59e0b' },
//     ];

//     return (
//         <div style={s.page}>
//             <style>{`
//                 @keyframes spin { to { transform: rotate(360deg); } }
//                 @media (max-width: 768px) {
//                     .ex-kpi-grid { grid-template-columns: 1fr 1fr !important; }
//                     .ex-quick-grid { grid-template-columns: 1fr 1fr !important; }
//                 }
//                 @media (max-width: 480px) {
//                     .ex-kpi-grid { grid-template-columns: 1fr !important; }
//                 }
//             `}</style>

//             {/* Banner */}
//             <div style={s.banner}>
//                 <div style={s.bannerBg} />
//                 <div style={s.bannerContent}>
//                     <div style={s.bannerLeft}>
//                         <div style={s.bannerBadge}>🏢 EXHIBITOR PORTAL</div>
//                         <h2 style={s.bannerTitle}>
//                             Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]}! 👋
//                         </h2>
//                         <p style={s.bannerSub}>Manage your expo applications and booth details from here.</p>
//                     </div>
//                     <button style={s.applyBtn}
//                         onClick={() => { setActiveTab('apply'); navigate('/exhibitor/apply'); }}
//                         onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.4)'; }}
//                         onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(16,185,129,0.3)'; }}
//                     >
//                         ＋ Apply for Expo
//                     </button>
//                 </div>
//             </div>

//             {/* KPI Cards */}
//             <div style={s.kpiGrid} className="ex-kpi-grid">
//                 {[
//                     { label: 'Total Applications', value: stats?.totalApps ?? 0,    icon: '📋', grad: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
//                     { label: 'Approved',            value: stats?.approvedApps ?? 0, icon: '✅', grad: 'linear-gradient(135deg,#10b981,#059669)' },
//                     { label: 'Pending Review',      value: stats?.pendingApps ?? 0,  icon: '⏳', grad: 'linear-gradient(135deg,#f59e0b,#d97706)' },
//                 ].map((k, i) => (
//                     <div key={i} style={s.kpiCard}
//                         onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
//                         onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
//                     >
//                         <div style={{ ...s.kpiIcon, background: k.grad }}>{k.icon}</div>
//                         <div>
//                             <div style={s.kpiVal}>{k.value}</div>
//                             <div style={s.kpiLabel}>{k.label}</div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* My Applications */}
//             <div style={s.card}>
//                 <div style={s.cardHead}>
//                     <h3 style={s.cardTitle}>📋 My Applications</h3>
//                     <button style={s.viewAllBtn}
//                         onClick={() => { setActiveTab('booths'); navigate('/exhibitor/booths'); }}
//                         onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
//                         onMouseLeave={e => e.currentTarget.style.background = 'none'}
//                     >View All →</button>
//                 </div>
//                 {!stats?.myApplications?.length ? (
//                     <div style={s.empty}>
//                         <div style={s.emptyIcon}>📋</div>
//                         <div>No applications yet. Apply for an expo to get started!</div>
//                     </div>
//                 ) : (
//                     stats.myApplications.map((app, i) => {
//                         const days = daysLeft(app.expo?.registrationDeadline);
//                         return (
//                             <div key={i} style={s.appRow}
//                                 onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
//                                 onMouseLeave={e => e.currentTarget.style.background = 'white'}
//                             >
//                                 <div style={{ flex: 1, minWidth: 0 }}>
//                                     <p style={s.appCompany}>{app.companyName}</p>
//                                     <p style={s.appMeta}>
//                                         🎪 {app.expo?.title} &nbsp;·&nbsp;
//                                         📍 {app.expo?.location} &nbsp;·&nbsp;
//                                         📅 {app.expo?.startDate ? new Date(app.expo.startDate).toLocaleDateString() : '—'}
//                                     </p>

//                                     {/* Booth info */}
//                                     {app.booth && (
//                                         <p style={{ fontSize: '12px', color: '#059669', fontWeight: '600', margin: '4px 0 0 0' }}>
//                                             🏢 Booth #{app.booth.boothNumber} — {app.booth.size} (${app.booth.price})
//                                         </p>
//                                     )}

//                                     {/* Deadline */}
//                                     {days !== null && days >= 0 && (
//                                         <span style={{ ...s.deadlineBadge(days), display: 'inline-flex', marginTop: '6px' }}>
//                                             ⏰ {days === 0 ? 'Deadline Today!' : `${days} days left`}
//                                         </span>
//                                     )}

//                                     {/* Rejection reason */}
//                                     {app.applicationStatus === 'rejected' && app.rejectionReason && (
//                                         <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0' }}>
//                                             ❌ {app.rejectionReason}
//                                         </p>
//                                     )}
//                                 </div>

//                                 <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', flexShrink: 0 }}>
//                                     <span style={s.statusPill(app.applicationStatus)}>{app.applicationStatus}</span>
//                                     {app.expo?.status && (
//                                         <span style={s.expoStatusPill(app.expo.status)}>{app.expo.status}</span>
//                                     )}
//                                 </div>
//                             </div>
//                         );
//                     })
//                 )}
//             </div>

//             {/* Quick Actions */}
//             <div style={s.card}>
//                 <div style={s.cardHead}>
//                     <h3 style={s.cardTitle}>⚡ Quick Actions</h3>
//                 </div>
//                 <div style={s.quickGrid} className="ex-quick-grid">
//                     {quickActions.map((a, i) => (
//                         <button key={i} style={s.quickBtn}
//                             onClick={() => { setActiveTab(a.tab); navigate(a.path); }}
//                             onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
//                             onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
//                         >
//                             <span style={s.quickIcon}>{a.icon}</span>
//                             <span style={s.quickLabel}>{a.label}</span>
//                             <span style={s.quickDesc}>{a.desc}</span>
//                         </button>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ExhibitorOverview;