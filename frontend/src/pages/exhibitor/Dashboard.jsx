import { useState, useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ExhibitorOverview from './OverviewContent';
import MyProfile from './MyProfile';
import ApplyForExpo from './ApplyForExpo';
import MyBooths from './MyBooths';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const menuItems = [
        { id: 'overview', label: 'Overview',       icon: '📊', path: '/exhibitor/dashboard' },
        { id: 'apply',    label: 'Apply for Expo', icon: '📋', path: '/exhibitor/apply'     },
        { id: 'booths',   label: 'My Booths',      icon: '🏢', path: '/exhibitor/booths'    },
        { id: 'profile',  label: 'My Profile',     icon: '👤', path: '/exhibitor/profile'   },
    ];

    const getPageTitle = () => ({
        overview : 'Exhibitor Dashboard',
        apply    : 'Apply for Expo',
        booths   : 'My Booths',
        profile  : 'My Profile',
    }[activeTab] || 'Dashboard');

    const handleNav = (item) => {
        setActiveTab(item.id);
        navigate(item.path);
        setMobileOpen(false);
    };

    return (
        <>
            <style>{`
                * { box-sizing: border-box; margin: 0; padding: 0; }
                .db-layout {
                    display: flex; min-height: 100vh;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    background: #f1f5f9;
                }
                .db-overlay {
                    display: none; position: fixed; inset: 0;
                    background: rgba(0,0,0,0.5); z-index: 40;
                    backdrop-filter: blur(2px);
                }
                .db-overlay.open { display: block; }
                .db-sidebar {
                    width: 260px;
                    background: linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%);
                    display: flex; flex-direction: column;
                    flex-shrink: 0; position: sticky;
                    top: 0; height: 100vh;
                    overflow-y: auto; overflow-x: hidden;
                    box-shadow: 4px 0 24px rgba(0,0,0,0.15);
                    transition: width 0.3s ease; z-index: 50;
                }
                .db-sidebar.collapsed { width: 72px; }
                @media (max-width: 768px) {
                    .db-sidebar {
                        position: fixed; top: 0; left: 0;
                        height: 100vh; width: 260px !important;
                        transform: translateX(-100%);
                        transition: transform 0.3s ease;
                    }
                    .db-sidebar.mobile-open { transform: translateX(0); }
                }
                .db-sidebar-top {
                    padding: 20px 16px;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    display: flex; align-items: center;
                    justify-content: space-between;
                    gap: 12px; min-height: 64px;
                }
                .db-logo-row { display: flex; align-items: center; gap: 10px; }
                .db-logo-box {
                    width: 36px; height: 36px; flex-shrink: 0;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 900; font-size: 13px; color: white;
                    box-shadow: 0 0 16px rgba(99,102,241,0.4);
                }
                .db-logo-text {
                    font-size: 16px; font-weight: 800;
                    color: white; white-space: nowrap; letter-spacing: -0.3px;
                }
                .db-logo-span { color: #818cf8; }
                .db-toggle-btn {
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.6);
                    width: 28px; height: 28px;
                    border-radius: 8px; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 11px; flex-shrink: 0; transition: all 0.2s;
                }
                .db-toggle-btn:hover { background: rgba(255,255,255,0.15); }
                @media (max-width: 768px) { .db-toggle-btn { display: none; } }
                .db-user-card {
                    margin: 12px; padding: 14px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 14px;
                    display: flex; align-items: center; gap: 12px; overflow: hidden;
                }
                .db-avatar {
                    width: 38px; height: 38px; flex-shrink: 0;
                    background: linear-gradient(135deg, #10b981, #059669);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 800; font-size: 15px; color: white;
                }
                .db-user-name { font-size: 13px; font-weight: 700; color: white; white-space: nowrap; }
                .db-user-role { font-size: 10px; font-weight: 600; color: #6ee7b7; text-transform: uppercase; letter-spacing: 0.06em; }
                .db-nav { flex: 1; padding: 8px; }
                .db-nav-btn {
                    width: 100%; display: flex; align-items: center;
                    gap: 12px; padding: 11px 14px;
                    border-radius: 12px; border: 1px solid transparent;
                    cursor: pointer; transition: all 0.2s;
                    margin-bottom: 2px; text-align: left;
                    background: transparent; color: rgba(255,255,255,0.55);
                    font-size: 13px; font-weight: 600;
                }
                .db-nav-btn.active {
                    background: linear-gradient(135deg, rgba(16,185,129,0.25), rgba(5,150,105,0.15));
                    border-color: rgba(16,185,129,0.4); color: #6ee7b7;
                }
                .db-nav-btn:not(.active):hover { background: rgba(255,255,255,0.06); }
                .db-nav-icon { font-size: 18px; flex-shrink: 0; }
                .db-nav-label { white-space: nowrap; }
                .db-sidebar.collapsed .db-nav-btn { justify-content: center; padding: 11px; }
                .db-sidebar.collapsed .db-nav-label,
                .db-sidebar.collapsed .db-user-name,
                .db-sidebar.collapsed .db-user-role,
                .db-sidebar.collapsed .db-logo-text { display: none; }
                .db-sidebar.collapsed .db-user-card { justify-content: center; }
                .db-sidebar.collapsed .db-logout-btn { justify-content: center; padding: 11px; }
                .db-sidebar.collapsed .db-logout-label { display: none; }
                .db-sidebar.collapsed .db-sidebar-top { justify-content: center; }
                .db-sidebar-bottom { padding: 12px; border-top: 1px solid rgba(255,255,255,0.06); }
                .db-logout-btn {
                    width: 100%; padding: 11px;
                    background: rgba(239,68,68,0.1);
                    border: 1px solid rgba(239,68,68,0.2);
                    color: #f87171; border-radius: 12px;
                    cursor: pointer; font-size: 13px; font-weight: 600;
                    display: flex; align-items: center;
                    justify-content: flex-start; gap: 10px; transition: all 0.2s;
                }
                .db-logout-btn:hover { background: rgba(239,68,68,0.2); }
                .db-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
                .db-topbar {
                    background: white; border-bottom: 1px solid #e2e8f0;
                    padding: 0 28px; height: 64px;
                    display: flex; align-items: center; justify-content: space-between;
                    position: sticky; top: 0; z-index: 10;
                    box-shadow: 0 1px 8px rgba(0,0,0,0.06); gap: 12px;
                }
                .db-hamburger {
                    display: none; background: none; border: none;
                    cursor: pointer; font-size: 22px;
                    color: #0f172a; flex-shrink: 0; padding: 4px;
                }
                @media (max-width: 768px) {
                    .db-hamburger { display: flex; align-items: center; }
                    .db-topbar { padding: 0 16px; }
                }
                .db-page-title { font-size: 18px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px; }
                .db-breadcrumb { font-size: 12px; color: #94a3b8; font-weight: 500; }
                .db-date-badge {
                    background: #f8fafc; border: 1px solid #e2e8f0;
                    border-radius: 8px; padding: 6px 12px;
                    font-size: 12px; color: #64748b; font-weight: 500;
                    white-space: nowrap; flex-shrink: 0;
                }
                @media (max-width: 480px) {
                    .db-date-badge { display: none; }
                    .db-page-title { font-size: 16px; }
                }
                .db-content { flex: 1; padding: 28px; overflow-y: auto; }
                @media (max-width: 640px) { .db-content { padding: 16px; } }
            `}</style>

            <div className="db-layout">

                {/* Mobile overlay */}
                <div
                    className={`db-overlay${mobileOpen ? ' open' : ''}`}
                    onClick={() => setMobileOpen(false)}
                />

                {/* SIDEBAR */}
                <aside className={`db-sidebar${sidebarOpen ? '' : ' collapsed'}${mobileOpen ? ' mobile-open' : ''}`}>
                    <div className="db-sidebar-top">
                        <div className="db-logo-row">
                            <div className="db-logo-box">ES</div>
                            <span className="db-logo-text">
                                Event<span className="db-logo-span">Sphere</span>
                            </span>
                        </div>
                        <button className="db-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            {sidebarOpen ? '◀' : '▶'}
                        </button>
                    </div>

                    <div className="db-user-card">
                        <div className="db-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                        <div style={{ overflow: 'hidden' }}>
                            <div className="db-user-name">{user?.name}</div>
                            <div className="db-user-role">{user?.role}</div>
                        </div>
                    </div>

                    <nav className="db-nav">
                        {menuItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleNav(item)}
                                className={`db-nav-btn${activeTab === item.id ? ' active' : ''}`}
                            >
                                <span className="db-nav-icon">{item.icon}</span>
                                <span className="db-nav-label">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="db-sidebar-bottom">
                        <button
                            className="db-logout-btn"
                            onClick={() => { logout(); navigate('/login'); }}
                        >
                            <span>🚪</span>
                            <span className="db-logout-label">Logout</span>
                        </button>
                    </div>
                </aside>

                {/* MAIN */}
                <main className="db-main">
                    <div className="db-topbar">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                            <button className="db-hamburger" onClick={() => setMobileOpen(true)}>☰</button>
                            <div style={{ minWidth: 0 }}>
                                <div className="db-page-title">{getPageTitle()}</div>
                                <div className="db-breadcrumb">EventSphere / Exhibitor / {activeTab}</div>
                            </div>
                        </div>
                        <div className="db-date-badge">
                            📅 {new Date().toLocaleDateString('en-US', {
                                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                            })}
                        </div>
                    </div>

                    <div className="db-content">
                        <Routes>
                            <Route path="/"        element={<ExhibitorOverview setActiveTab={setActiveTab} />} />
                            <Route path="/apply"   element={<ApplyForExpo />} />
                            <Route path="/booths"  element={<MyBooths />} />
                            <Route path="/profile" element={<MyProfile />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Dashboard;