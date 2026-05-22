import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import NotificationBell from '../common/NotificationBell';

const Navbar = () => {
    const { user, logout, getDashboardPath } = useContext(AuthContext);
    const navigate  = useNavigate();
    const location  = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled]     = useState(false);

    /* close mobile menu on route change */
    useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    /* safe dashboard path — guard if getDashboardPath is undefined */
    const dashPath = typeof getDashboardPath === 'function'
        ? getDashboardPath(user?.role)
        : '/';

    const getDashboardLabel = () => {
        if (!user) return '';
        if (user.role === 'admin' || user.role === 'organizer') return '⚙️ Admin Panel';
        if (user.role === 'exhibitor') return '🏢 My Portal';
        return '🎟️ My Dashboard';
    };

    /* avatar initial — safe fallback */
    const avatarInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

    const styles = {
        nav: {
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            background: scrolled
                ? 'rgba(15, 23, 42, 0.97)'
                : 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
            backdropFilter: 'blur(20px)',
            borderBottom: scrolled ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
            transition: 'all 0.3s ease',
            boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
            fontFamily: "'Segoe UI', system-ui, sans-serif",
        },
        inner: {
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '68px',
        },
        logo: {
            display: 'flex', alignItems: 'center', gap: '10px',
            textDecoration: 'none',
        },
        logoIcon: {
            width: '38px', height: '38px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '900', fontSize: '14px', color: 'white',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
            letterSpacing: '-0.5px',
        },
        logoText: { fontSize: '20px', fontWeight: '800', color: 'white', letterSpacing: '-0.5px' },
        logoSpan: { color: '#818cf8' },
        desktopNav: { display: 'flex', alignItems: 'center', gap: '8px' },
        navLink: {
            color: 'rgba(255,255,255,0.75)', textDecoration: 'none',
            fontSize: '14px', fontWeight: '500',
            padding: '8px 14px', borderRadius: '8px',
            transition: 'all 0.2s ease', letterSpacing: '0.01em',
        },
        dashboardBtn: {
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            color: '#a5b4fc', textDecoration: 'none',
            fontSize: '13px', fontWeight: '600',
            padding: '8px 16px', borderRadius: '8px',
            transition: 'all 0.2s ease', cursor: 'pointer',
        },
        logoutBtn: {
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', color: 'white',
            fontSize: '13px', fontWeight: '600',
            padding: '9px 20px', borderRadius: '8px',
            cursor: 'pointer', transition: 'all 0.2s ease',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)',
        },
        loginLink: {
            color: 'rgba(255,255,255,0.75)', textDecoration: 'none',
            fontSize: '14px', fontWeight: '500',
            padding: '8px 14px', borderRadius: '8px',
            transition: 'all 0.2s ease',
        },
        registerBtn: {
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white', textDecoration: 'none',
            fontSize: '13px', fontWeight: '600',
            padding: '9px 20px', borderRadius: '8px',
            transition: 'all 0.2s ease',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)',
        },
        userChip: {
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px', padding: '4px 14px 4px 4px',
        },
        avatar: {
            width: '30px', height: '30px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: '700', color: 'white',
        },
        userName : { fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
        roleBadge: { fontSize: '10px', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' },
        hamburger: {
            background: 'none', border: '1px solid rgba(255,255,255,0.2)',
            color: 'white', width: '38px', height: '38px',
            borderRadius: '8px', cursor: 'pointer', fontSize: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        },
        mobileMenu: {
            background: 'rgba(15, 23, 42, 0.98)',
            borderTop: '1px solid rgba(99, 102, 241, 0.2)',
            padding: '16px 24px 20px',
            display: 'flex', flexDirection: 'column', gap: '4px',
        },
        mobileLink: {
            color: 'rgba(255,255,255,0.8)', textDecoration: 'none',
            fontSize: '15px', fontWeight: '500',
            padding: '12px 16px', borderRadius: '10px',
            transition: 'all 0.2s', background: 'transparent',
            border: 'none', cursor: 'pointer',
            textAlign: 'left', display: 'block',
        },
        mobileDivider: { height: '1px', background: 'rgba(255,255,255,0.08)', margin: '8px 0' },
        mobileLogout: {
            color: '#f87171', background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            fontSize: '15px', fontWeight: '600',
            padding: '12px 16px', borderRadius: '10px',
            cursor: 'pointer', textAlign: 'left',
            width: '100%', marginTop: '4px',
        },
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.inner}>
                {/* Logo */}
                <Link to="/" style={styles.logo}>
                    <div style={styles.logoIcon}>ES</div>
                    <span style={styles.logoText}>
                        Event<span style={styles.logoSpan}>Sphere</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div style={styles.desktopNav} className="desktop-nav">
                    <Link
                        to="/"
                        style={styles.navLink}
                        onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.background = 'transparent'; }}
                    >
                        Home
                    </Link>
                    <Link
                        to="/expos"
                        style={styles.navLink}
                        onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.background = 'transparent'; }}
                    >
                        Expos
                    </Link>

                    {user ? (
                        <>
                            <div style={styles.userChip}>
                                <div style={styles.avatar}>{avatarInitial}</div>
                                <div>
                                    <div style={styles.userName}>{user.name?.split(' ')[0]}</div>
                                    <div style={styles.roleBadge}>{user.role}</div>
                                </div>
                            </div>

                            <Link
                                to={dashPath}
                                style={styles.dashboardBtn}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.3)'; e.currentTarget.style.color = 'white'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.color = '#a5b4fc'; }}
                            >
                                {getDashboardLabel()}
                            </Link>

                            {user && <NotificationBell />}

                            <button
                                onClick={handleLogout}
                                style={styles.logoutBtn}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.5)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(99,102,241,0.3)'; }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                style={styles.loginLink}
                                onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.background = 'transparent'; }}
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                style={styles.registerBtn}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.5)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(99,102,241,0.3)'; }}
                            >
                                Get Started →
                            </Link>
                        </>
                    )}
                </div>

                {/* Hamburger */}
                <button
                    style={styles.hamburger}
                    onClick={() => setIsMenuOpen(prev => !prev)}
                    className="mobile-hamburger"
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div style={styles.mobileMenu}>
                    {user && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', marginBottom: '4px' }}>
                                <div style={{ ...styles.avatar, width: '36px', height: '36px', fontSize: '14px' }}>
                                    {avatarInitial}
                                </div>
                                <div>
                                    <div style={{ color: 'white', fontWeight: '700', fontSize: '15px' }}>{user.name}</div>
                                    <div style={styles.roleBadge}>{user.role}</div>
                                </div>
                            </div>
                            <div style={styles.mobileDivider} />
                        </>
                    )}

                    <Link to="/"      style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>🏠 Home</Link>
                    <Link to="/expos" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>🎪 Expos</Link>

                    {user ? (
                        <>
                            <Link to={dashPath} style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
                                {getDashboardLabel()}
                            </Link>
                            <div style={styles.mobileDivider} />
                            <button style={styles.mobileLogout} onClick={handleLogout}>
                                🚪 Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <div style={styles.mobileDivider} />
                            <Link to="/login"    style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>🔑 Login</Link>
                            <Link
                                to="/register"
                                style={{ ...styles.mobileLink, color: '#818cf8', fontWeight: '700' }}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                ✨ Get Started
                            </Link>
                        </>
                    )}
                </div>
            )}

            <style>{`
                @media (min-width: 768px) {
                    .mobile-hamburger { display: none !important; }
                    .desktop-nav      { display: flex !important; }
                }
                @media (max-width: 767px) {
                    .desktop-nav      { display: none !important; }
                    .mobile-hamburger { display: flex !important; }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;