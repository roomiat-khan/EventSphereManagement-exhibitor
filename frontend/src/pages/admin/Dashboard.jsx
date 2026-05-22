import { useState, useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import ManageExpos from './ManageExpos';
import ManageBooths from './ManageBooths';
import ManageExhibitors from './ManageExhibitors';
import ManageSessions from './ManageSessions';
import Analytics from './Analytics';
import OverviewContent from './OverviewContent';
import ManageFeedback from './ManageFeedback';
import ManageTickets from './ManageTickets';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    const menuItems = [
        { id: 'overview',   label: 'Overview',        icon: '📊', path: '/admin/dashboard'   },
        { id: 'expos',      label: 'Manage Expos',    icon: '🎪', path: '/admin/expos'        },
        { id: 'booths',     label: 'Manage Booths',   icon: '🏢', path: '/admin/booths'       },
        { id: 'exhibitors', label: 'Exhibitors',      icon: '👥', path: '/admin/exhibitors'   },
        { id: 'sessions',   label: 'Sessions',        icon: '📅', path: '/admin/sessions'     },
        { id: 'tickets',    label: 'Tickets',         icon: '🎟️', path: '/admin/tickets'      },
        { id: 'analytics',  label: 'Analytics',       icon: '📈', path: '/admin/analytics'    },
        { id: 'feedback',   label: 'Feedback',        icon: '💬', path: '/admin/feedback'     },
    ];

    const getPageTitle = () => ({
        overview:   'Dashboard Overview',
        expos:      'Manage Expos',
        booths:     'Manage Booths',
        exhibitors: 'Exhibitor Applications',
        sessions:   'Session Management',
        tickets:    'Ticket Management',
        analytics:  'Analytics & Reports',
        feedback:   'Manage Feedback',
    }[activeTab] || 'Dashboard');

    const s = {
        layout: { display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#f1f5f9' },
        sidebar: {
            width: sidebarOpen ? '260px' : '72px',
            background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
            display: 'flex', flexDirection: 'column',
            transition: 'width 0.3s ease', flexShrink: 0,
            position: 'sticky', top: 0, height: '100vh',
            overflowY: 'auto', overflowX: 'hidden',
            boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
        },
        sidebarTop: {
            padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center',
            justifyContent: sidebarOpen ? 'space-between' : 'center', gap: '12px',
        },
        logoRow: { display: 'flex', alignItems: 'center', gap: '10px' },
        logoBox: {
            width: '36px', height: '36px', flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '10px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontWeight: '900', fontSize: '13px', color: 'white',
            boxShadow: '0 0 16px rgba(99,102,241,0.4)',
        },
        logoText: { fontSize: '16px', fontWeight: '800', color: 'white', whiteSpace: 'nowrap', letterSpacing: '-0.3px' },
        logoSpan: { color: '#818cf8' },
        toggleBtn: {
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)', width: '28px', height: '28px',
            borderRadius: '8px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', flexShrink: 0, transition: 'all 0.2s',
        },
        userCard: {
            margin: '12px', padding: '14px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden',
        },
        avatar: {
            width: '38px', height: '38px', flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontWeight: '800', fontSize: '15px', color: 'white',
        },
        userName: { fontSize: '13px', fontWeight: '700', color: 'white', whiteSpace: 'nowrap' },
        userRole: { fontSize: '10px', fontWeight: '600', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.06em' },
        nav: { flex: 1, padding: '8px' },
        navBtn: {
            width: '100%', display: 'flex', alignItems: 'center',
            gap: '12px', padding: sidebarOpen ? '11px 14px' : '11px',
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
            borderRadius: '12px', border: 'none', cursor: 'pointer',
            transition: 'all 0.2s', marginBottom: '2px', textAlign: 'left',
        },
        navBtnActive: { background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))', border: '1px solid rgba(99,102,241,0.4)' },
        navBtnInactive: { background: 'transparent', border: '1px solid transparent' },
        navIcon: { fontSize: '18px', flexShrink: 0 },
        navLabel: { fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' },
        sidebarBottom: { padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' },
        logoutBtn: {
            width: '100%', padding: '11px',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            color: '#f87171', borderRadius: '12px', cursor: 'pointer',
            fontSize: '13px', fontWeight: '600',
            display: 'flex', alignItems: 'center',
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
            gap: '10px', transition: 'all 0.2s',
        },
        main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
        topbar: {
            background: 'white', borderBottom: '1px solid #e2e8f0',
            padding: '0 28px', height: '64px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'sticky', top: 0, zIndex: 10,
            boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        },
        pageTitle: { fontSize: '18px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.3px' },
        breadcrumb: { fontSize: '12px', color: '#94a3b8', fontWeight: '500' },
        dateBadge: {
            background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: '8px', padding: '6px 12px',
            fontSize: '12px', color: '#64748b', fontWeight: '500',
        },
        content: { flex: 1, padding: '28px', overflowY: 'auto' },
    };

    return (
        <div style={s.layout}>
            <aside style={s.sidebar}>
                <div style={s.sidebarTop}>
                    {sidebarOpen && (
                        <div style={s.logoRow}>
                            <div style={s.logoBox}>ES</div>
                            <span style={s.logoText}>Event<span style={s.logoSpan}>Sphere</span></span>
                        </div>
                    )}
                    <button style={s.toggleBtn} onClick={() => setSidebarOpen(!sidebarOpen)}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                    >
                        {sidebarOpen ? '◀' : '▶'}
                    </button>
                </div>

                <div style={s.userCard}>
                    <div style={s.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
                    {sidebarOpen && (
                        <div style={{ overflow: 'hidden' }}>
                            <div style={s.userName}>{user?.name}</div>
                            <div style={s.userRole}>{user?.role}</div>
                        </div>
                    )}
                </div>

                <nav style={s.nav}>
                    {menuItems.map(item => (
                        <button key={item.id}
                            onClick={() => { setActiveTab(item.id); navigate(item.path); }}
                            style={{
                                ...s.navBtn,
                                ...(activeTab === item.id ? s.navBtnActive : s.navBtnInactive),
                                color: activeTab === item.id ? '#a5b4fc' : 'rgba(255,255,255,0.55)',
                            }}
                            onMouseEnter={e => { if (activeTab !== item.id) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                            onMouseLeave={e => { if (activeTab !== item.id) e.currentTarget.style.background = 'transparent'; }}
                        >
                            <span style={s.navIcon}>{item.icon}</span>
                            {sidebarOpen && <span style={s.navLabel}>{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div style={s.sidebarBottom}>
                    <button style={s.logoutBtn}
                        onClick={() => { logout(); navigate('/login'); }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                    >
                        <span>🚪</span>
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            <main style={s.main}>
                <div style={s.topbar}>
                    <div>
                        <div style={s.pageTitle}>{getPageTitle()}</div>
                        <div style={s.breadcrumb}>EventSphere / Admin / {activeTab}</div>
                    </div>
                    <div style={s.dateBadge}>
                        📅 {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                </div>

                <div style={s.content}>
                    <Routes>
                        <Route path="/"            element={<OverviewContent setActiveTab={setActiveTab} />} />
                        <Route path="/expos/*"      element={<ManageExpos />}      />
                        <Route path="/booths/*"     element={<ManageBooths />}     />
                        <Route path="/exhibitors/*" element={<ManageExhibitors />} />
                        <Route path="/sessions/*"   element={<ManageSessions />}   />
                        <Route path="/tickets"      element={<ManageTickets />}    />
                        <Route path="/analytics"    element={<Analytics />}        />
                        <Route path="/feedback"     element={<ManageFeedback />}   />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;