import { useState, useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import AttendeeOverview from './OverviewContent';
import BrowseExpos from './BrowseExpos';
import Sessions from './Sessions';
import MyBookings from './MyBookings';
import SearchExhibitors from './SearchExhibitors';
import Feedback from './Feedback';
import Bookmarks from './Bookmarks';
import EventPass from './EventPass';
import MyTickets from './MyTickets';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const menuItems = [
        { id: 'overview',  label: 'Overview',        icon: '📊', path: '/attendee/dashboard' },
        { id: 'expos',     label: 'Browse Expos',    icon: '🎪', path: '/attendee/expos'     },
        { id: 'sessions',  label: 'Sessions',        icon: '📅', path: '/attendee/sessions'  },
        { id: 'bookings',  label: 'My Bookings',     icon: '🎟️', path: '/attendee/bookings'  },
        { id: 'tickets',   label: 'My Tickets',      icon: '🎫', path: '/attendee/tickets'   },
        { id: 'bookmarks', label: 'Bookmarks',       icon: '🔖', path: '/attendee/bookmarks' },
        { id: 'pass',      label: 'Event Pass',      icon: '🪪', path: '/attendee/pass'      },
        { id: 'search',    label: 'Find Exhibitors', icon: '🔍', path: '/attendee/search'    },
        { id: 'feedback',  label: 'Feedback',        icon: '💬', path: '/attendee/feedback'  },
    ];

    const getPageTitle = () => ({
        overview  : 'Attendee Dashboard',
        expos     : 'Browse Expos',
        sessions  : 'Sessions',
        bookings  : 'My Bookings',
        tickets   : 'My Tickets',
        bookmarks : 'Bookmarked Sessions',
        pass      : 'Digital Event Pass',
        search    : 'Find Exhibitors',
        feedback  : 'Feedback',
    }[activeTab] || 'Dashboard');

    const handleNav = (item) => {
        setActiveTab(item.id);
        navigate(item.path);
        setMobileOpen(false);
    };

    return (
        <>
            <style>{`
                * { box-sizing: border-box; }
                .at-layout { display: flex; min-height: 100vh; font-family: 'Segoe UI', system-ui, sans-serif; background: #f1f5f9; }
                .at-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 40; backdrop-filter: blur(2px); }
                .at-overlay.open { display: block; }
                .at-sidebar { width: 260px; background: linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%); display: flex; flex-direction: column; flex-shrink: 0; position: sticky; top: 0; height: 100vh; overflow-y: auto; overflow-x: hidden; box-shadow: 4px 0 24px rgba(0,0,0,0.15); transition: width 0.3s ease; z-index: 50; }
                .at-sidebar.collapsed { width: 72px; }
                @media (max-width: 768px) { .at-sidebar { position: fixed; top: 0; left: 0; height: 100vh; width: 260px !important; transform: translateX(-100%); transition: transform 0.3s ease; } .at-sidebar.mobile-open { transform: translateX(0); } }
                .at-sidebar-top { padding: 20px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 64px; }
                .at-logo-row { display: flex; align-items: center; gap: 10px; }
                .at-logo-box { width: 36px; height: 36px; flex-shrink: 0; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; color: white; box-shadow: 0 0 16px rgba(99,102,241,0.4); }
                .at-logo-text { font-size: 16px; font-weight: 800; color: white; white-space: nowrap; letter-spacing: -0.3px; }
                .at-logo-span { color: #818cf8; }
                .at-toggle-btn { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); width: 28px; height: 28px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; transition: all 0.2s; }
                .at-toggle-btn:hover { background: rgba(255,255,255,0.15); }
                @media (max-width: 768px) { .at-toggle-btn { display: none; } }
                .at-user-card { margin: 12px; padding: 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; display: flex; align-items: center; gap: 12px; overflow: hidden; }
                .at-avatar { width: 38px; height: 38px; flex-shrink: 0; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 15px; color: white; }
                .at-user-name { font-size: 13px; font-weight: 700; color: white; white-space: nowrap; }
                .at-user-role { font-size: 10px; font-weight: 600; color: #818cf8; text-transform: uppercase; letter-spacing: 0.06em; }
                .at-nav { flex: 1; padding: 8px; }
                .at-nav-btn { width: 100%; display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 12px; border: 1px solid transparent; cursor: pointer; transition: all 0.2s; margin-bottom: 2px; text-align: left; background: transparent; color: rgba(255,255,255,0.55); font-size: 13px; font-weight: 600; }
                .at-nav-btn.active { background: linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2)); border-color: rgba(99,102,241,0.4); color: #a5b4fc; }
                .at-nav-btn:not(.active):hover { background: rgba(255,255,255,0.06); }
                .at-nav-icon { font-size: 18px; flex-shrink: 0; }
                .at-nav-label { white-space: nowrap; }
                .at-sidebar.collapsed .at-nav-btn { justify-content: center; padding: 11px; }
                .at-sidebar.collapsed .at-nav-label, .at-sidebar.collapsed .at-user-name, .at-sidebar.collapsed .at-user-role, .at-sidebar.collapsed .at-logo-text { display: none; }
                .at-sidebar.collapsed .at-user-card { justify-content: center; }
                .at-sidebar.collapsed .at-logout-btn { justify-content: center; padding: 11px; }
                .at-sidebar.collapsed .at-logout-label { display: none; }
                .at-sidebar.collapsed .at-sidebar-top { justify-content: center; }
                .at-sidebar-bottom { padding: 12px; border-top: 1px solid rgba(255,255,255,0.06); }
                .at-logout-btn { width: 100%; padding: 11px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #f87171; border-radius: 12px; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: flex-start; gap: 10px; transition: all 0.2s; }
                .at-logout-btn:hover { background: rgba(239,68,68,0.2); }
                .at-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
                .at-topbar { background: white; border-bottom: 1px solid #e2e8f0; padding: 0 28px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 10; box-shadow: 0 1px 8px rgba(0,0,0,0.06); gap: 12px; }
                .at-hamburger { display: none; background: none; border: none; cursor: pointer; font-size: 22px; color: #0f172a; flex-shrink: 0; padding: 4px; }
                @media (max-width: 768px) { .at-hamburger { display: flex; align-items: center; } .at-topbar { padding: 0 16px; } }
                .at-page-title { font-size: 18px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px; }
                .at-breadcrumb { font-size: 12px; color: #94a3b8; font-weight: 500; }
                .at-date-badge { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 12px; font-size: 12px; color: #64748b; font-weight: 500; white-space: nowrap; flex-shrink: 0; }
                @media (max-width: 480px) { .at-date-badge { display: none; } .at-page-title { font-size: 16px; } }
                .at-content { flex: 1; padding: 28px; overflow-y: auto; }
                @media (max-width: 640px) { .at-content { padding: 16px; } }
            `}</style>

            <div className="at-layout">
                <div className={`at-overlay${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(false)} />

                <aside className={`at-sidebar${sidebarOpen ? '' : ' collapsed'}${mobileOpen ? ' mobile-open' : ''}`}>
                    <div className="at-sidebar-top">
                        <div className="at-logo-row">
                            <div className="at-logo-box">ES</div>
                            <span className="at-logo-text">Event<span className="at-logo-span">Sphere</span></span>
                        </div>
                        <button className="at-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            {sidebarOpen ? '◀' : '▶'}
                        </button>
                    </div>

                    <div className="at-user-card">
                        <div className="at-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                        <div style={{ overflow: 'hidden' }}>
                            <div className="at-user-name">{user?.name}</div>
                            <div className="at-user-role">{user?.role}</div>
                        </div>
                    </div>

                    <nav className="at-nav">
                        {menuItems.map(item => (
                            <button key={item.id} onClick={() => handleNav(item)}
                                className={`at-nav-btn${activeTab === item.id ? ' active' : ''}`}
                            >
                                <span className="at-nav-icon">{item.icon}</span>
                                <span className="at-nav-label">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="at-sidebar-bottom">
                        <button className="at-logout-btn" onClick={() => { logout(); navigate('/login'); }}>
                            <span>🚪</span>
                            <span className="at-logout-label">Logout</span>
                        </button>
                    </div>
                </aside>

                <main className="at-main">
                    <div className="at-topbar">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                            <button className="at-hamburger" onClick={() => setMobileOpen(true)}>☰</button>
                            <div style={{ minWidth: 0 }}>
                                <div className="at-page-title">{getPageTitle()}</div>
                                <div className="at-breadcrumb">EventSphere / Attendee / {activeTab}</div>
                            </div>
                        </div>
                        <div className="at-date-badge">
                            📅 {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>

                    <div className="at-content">
                        <Routes>
                            <Route path="/"          element={<AttendeeOverview setActiveTab={setActiveTab} />} />
                            <Route path="/expos"     element={<BrowseExpos />}      />
                            <Route path="/sessions"  element={<Sessions />}         />
                            <Route path="/bookings"  element={<MyBookings />}       />
                            <Route path="/tickets"   element={<MyTickets />}        />
                            <Route path="/bookmarks" element={<Bookmarks />}        />
                            <Route path="/pass"      element={<EventPass />}        />
                            <Route path="/search"    element={<SearchExhibitors />} />
                            <Route path="/feedback"  element={<Feedback />}         />
                        </Routes>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Dashboard;