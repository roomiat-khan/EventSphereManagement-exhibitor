import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const { user, getDashboardPath } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock events data (ye baad mein API se aayega)
    useEffect(() => {
        // Temporary mock data - isko baad mein real API se replace karna
        const mockEvents = [
            { id: 1, title: "Tech Expo 2026", date: "March 15-17, 2026", location: "Dubai World Trade Centre", price: "$299", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop", category: "Technology", booths: 120 },
            { id: 2, title: "Auto Show International", date: "April 5-9, 2026", location: "Mumbai Exhibition Centre", price: "$199", image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=500&h=300&fit=crop", category: "Automotive", booths: 85 },
            { id: 3, title: "Fashion Week", date: "May 10-12, 2026", location: "London Fashion Hub", price: "$349", image: "https://images.unsplash.com/photo-1537832816519-689ad163238b?w=500&h=300&fit=crop", category: "Fashion", booths: 60 },
            { id: 4, title: "Food & Beverage Expo", date: "June 20-22, 2026", location: "Singapore Expo", price: "$149", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=300&fit=crop", category: "Food", booths: 95 },
            { id: 5, title: "Education Summit", date: "July 8-10, 2026", location: "Berlin Congress Center", price: "$249", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&h=300&fit=crop", category: "Education", booths: 50 },
            { id: 6, title: "Healthcare Innovation Expo", date: "August 12-14, 2026", location: "Boston Convention Center", price: "$399", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=300&fit=crop", category: "Healthcare", booths: 110 },
        ];
        setEvents(mockEvents);
        setLoading(false);
    }, []);

    // Scroll animations
    useEffect(() => {
        const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
        
        // Back to top button
        const backTop = document.getElementById('backTop');
        const handleScroll = () => {
            if (backTop) backTop.style.display = window.scrollY > 300 ? 'flex' : 'none';
        };
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const services = [
        { icon: "🎯", title: "Event Planning", desc: "End-to-end event management solutions" },
        { icon: "🏢", title: "Booth Management", desc: "Interactive floor plans & allocations" },
        { icon: "📊", title: "Analytics", desc: "Real-time insights & reporting" },
        { icon: "🤝", title: "Networking", desc: "Connect exhibitors & attendees" },
        { icon: "📱", title: "Mobile App", desc: "Dedicated event mobile experience" },
        { icon: "🎫", title: "Ticketing", desc: "Seamless online registration" },
    ];

    const tickets = [
        { name: "Standard", price: "$99", features: ["Access to all events", "Basic networking", "Event materials", "Standard support"], popular: false },
        { name: "Premium", price: "$249", features: ["Everything in Standard", "VIP lounge access", "Priority booking", "Meet & greet", "Exclusive merch"], popular: true },
        { name: "Enterprise", price: "$499", features: ["Everything in Premium", "Dedicated booth", "Brand visibility", "Speaking opportunity", "Post-event data"], popular: false },
    ];

    return (
        <div style={styles.page}>
            <style>{`
                * { margin: 0; padding: 0; box-sizing: border-box; }
                .animate-on-scroll {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: opacity 0.7s ease, transform 0.7s ease;
                }
                .animate-on-scroll.show {
                    opacity: 1;
                    transform: translateY(0);
                }
                .event-card, .service-card, .ticket-card {
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                .event-card:hover, .service-card:hover, .ticket-card:hover {
                    transform: translateY(-8px);
                }
                .ticket-card.popular {
                    transform: scale(1.02);
                    border: 2px solid #ff6b35;
                }
                .ticket-card.popular:hover {
                    transform: translateY(-8px) scale(1.02);
                }
                @media (max-width: 768px) {
                    .ticket-card.popular {
                        transform: scale(1);
                    }
                    .events-grid, .services-grid, .tickets-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
                @media (max-width: 640px) {
                    .hero-buttons {
                        flex-direction: column !important;
                        align-items: center !important;
                    }
                    .hero-buttons a {
                        width: 100% !important;
                        text-align: center !important;
                    }
                }
            `}</style>

            {/* HERO SECTION */}
            <section style={styles.hero}>
                <div style={styles.heroOverlay}></div>
                <div style={styles.heroContent}>
                    <div className="animate-on-scroll">
                        <span style={styles.heroBadge}>✨ Welcome to EventSphere</span>
                        <h1 style={styles.heroTitle}>
                            Where Great<br />
                            <span style={styles.heroTitleAccent}>Events Come to Life</span>
                        </h1>
                        <p style={styles.heroSubtext}>
                            The ultimate platform for organizers, exhibitors, and attendees<br />
                            to connect, engage, and create unforgettable experiences.
                        </p>
                        <div className="hero-buttons" style={styles.heroButtons}>
                            {!user ? (
                                <>
                                    <Link to="/register" style={styles.btnPrimary}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                        Get Started Free →
                                    </Link>
                                    <Link to="/login" style={styles.btnSecondary}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                        Sign In
                                    </Link>
                                </>
                            ) : (
                                <Link to={getDashboardPath(user.role)} style={styles.btnPrimary}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                    Go to Dashboard →
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS SECTION */}
            <section style={styles.statsSection}>
                <div style={styles.statsContainer}>
                    {[
                        { num: "500+", label: "Events Hosted" },
                        { num: "12K+", label: "Exhibitors" },
                        { num: "150K+", label: "Attendees" },
                        { num: "50+", label: "Countries" },
                    ].map((stat, i) => (
                        <div key={i} className="animate-on-scroll" style={styles.statItem}>
                            <div style={styles.statNum}>{stat.num}</div>
                            <div style={styles.statLabel}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* EVENTS SECTION */}
            <section style={styles.sectionLight}>
                <div style={styles.container}>
                    <div className="animate-on-scroll" style={styles.sectionHeader}>
                        <span style={styles.sectionBadge}>Upcoming Events</span>
                        <h2 style={styles.sectionTitle}>Featured Expos & Trade Shows</h2>
                        <p style={styles.sectionSubtext}>Discover the most anticipated events around the world</p>
                    </div>

                    {loading ? (
                        <div style={styles.loading}>Loading events...</div>
                    ) : (
                        <div className="events-grid" style={styles.eventsGrid}>
                            {events.map((event, i) => (
                                <div key={event.id} className="event-card animate-on-scroll" style={styles.eventCard}>
                                    <div style={styles.eventImageWrapper}>
                                        <img src={event.image} alt={event.title} style={styles.eventImage} />
                                        <span style={styles.eventCategory}>{event.category}</span>
                                    </div>
                                    <div style={styles.eventBody}>
                                        <h3 style={styles.eventTitle}>{event.title}</h3>
                                        <div style={styles.eventMeta}>
                                            <span>📅 {event.date}</span>
                                            <span>📍 {event.location}</span>
                                        </div>
                                        <div style={styles.eventFooter}>
                                            <span style={styles.eventPrice}>{event.price}</span>
                                            <Link to={`/events/${event.id}`} style={styles.eventBtn}>View Details →</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div style={styles.viewAllWrapper}>
                        <Link to="/events" style={styles.viewAllBtn}>View All Events →</Link>
                    </div>
                </div>
            </section>

            {/* SERVICES SECTION */}
            <section style={styles.sectionDark}>
                <div style={styles.container}>
                    <div className="animate-on-scroll" style={styles.sectionHeader}>
                        <span style={{ ...styles.sectionBadge, background: 'rgba(255,107,53,0.15)', color: '#ff6b35' }}>What We Offer</span>
                        <h2 style={{ ...styles.sectionTitle, color: 'white' }}>Comprehensive Event Solutions</h2>
                        <p style={{ ...styles.sectionSubtext, color: 'rgba(255,255,255,0.7)' }}>Everything you need to host successful events</p>
                    </div>
                    
                    <div className="services-grid" style={styles.servicesGrid}>
                        {services.map((service, i) => (
                            <div key={i} className="service-card animate-on-scroll" style={styles.serviceCard}
                                onMouseEnter={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.borderColor = '#ff6b35'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#1e1e2e'; e.currentTarget.style.borderColor = '#2d2d3d'; }}>
                                <div style={styles.serviceIcon}>{service.icon}</div>
                                <h3 style={styles.serviceTitle}>{service.title}</h3>
                                <p style={styles.serviceDesc}>{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TICKETS SECTION */}
            <section style={styles.sectionLight}>
                <div style={styles.container}>
                    <div className="animate-on-scroll" style={styles.sectionHeader}>
                        <span style={styles.sectionBadge}>Pricing Plans</span>
                        <h2 style={styles.sectionTitle}>Choose Your Ticket</h2>
                        <p style={styles.sectionSubtext}>Flexible plans for every need and budget</p>
                    </div>
                    
                    <div className="tickets-grid" style={styles.ticketsGrid}>
                        {tickets.map((ticket, i) => (
                            <div key={i} className={`ticket-card animate-on-scroll ${ticket.popular ? 'popular' : ''}`} style={{ ...styles.ticketCard, ...(ticket.popular ? styles.ticketCardPopular : {}) }}
                                onMouseEnter={e => { if (!ticket.popular) e.currentTarget.style.borderColor = '#ff6b35'; }}
                                onMouseLeave={e => { if (!ticket.popular) e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                                {ticket.popular && <div style={styles.popularBadge}>🔥 Most Popular</div>}
                                <h3 style={styles.ticketName}>{ticket.name}</h3>
                                <div style={styles.ticketPrice}>
                                    <span style={styles.ticketPriceNum}>{ticket.price}</span>
                                    <span style={styles.ticketPricePeriod}>/event</span>
                                </div>
                                <ul style={styles.ticketFeatures}>
                                    {ticket.features.map((feature, j) => (
                                        <li key={j} style={styles.ticketFeature}>✓ {feature}</li>
                                    ))}
                                </ul>
                                <Link to="/register" style={{ ...styles.ticketBtn, ...(ticket.popular ? styles.ticketBtnPopular : {}) }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                    Get Started →
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section style={styles.aboutSection}>
                <div style={styles.container}>
                    <div style={styles.aboutGrid}>
                        <div className="animate-on-scroll" style={styles.aboutContent}>
                            <span style={styles.sectionBadge}>About Us</span>
                            <h2 style={{ ...styles.sectionTitle, color: '#0f172a', textAlign: 'left', marginBottom: '20px' }}>Revolutionizing Event Management</h2>
                            <p style={styles.aboutText}>
                                EventSphere is a cutting-edge platform designed to streamline the entire event lifecycle — from planning and promotion to execution and analytics.
                            </p>
                            <p style={styles.aboutText}>
                                Founded by industry experts, we understand the challenges of managing large-scale expos. Our mission is to provide a seamless, technology-driven solution that empowers organizers, exhibitors, and attendees alike.
                            </p>
                            <div style={styles.aboutFeatures}>
                                <div style={styles.aboutFeature}>
                                    <span style={styles.aboutFeatureIcon}>✅</span>
                                    <span>100+ Events Managed</span>
                                </div>
                                <div style={styles.aboutFeature}>
                                    <span style={styles.aboutFeatureIcon}>✅</span>
                                    <span>Global Reach</span>
                                </div>
                                <div style={styles.aboutFeature}>
                                    <span style={styles.aboutFeatureIcon}>✅</span>
                                    <span>24/7 Support</span>
                                </div>
                            </div>
                        </div>
                        <div className="animate-on-scroll" style={styles.aboutImage}>
                            <img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop" alt="About EventSphere" style={styles.aboutImg} />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section style={styles.ctaSection}>
                <div style={styles.ctaContainer}>
                    <div className="animate-on-scroll" style={styles.ctaContent}>
                        <h2 style={styles.ctaTitle}>Ready to Host Your Next Big Event?</h2>
                        <p style={styles.ctaSubtext}>
                            Join thousands of organizers already using EventSphere to create unforgettable experiences.
                        </p>
                        <Link to={user ? getDashboardPath(user.role) : '/register'} style={styles.ctaBtn}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#e85d2a'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#ff6b35'; }}>
                            {user ? 'Go to Dashboard →' : 'Start Organizing Today →'}
                        </Link>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={styles.footer}>
                <div style={styles.container}>
                    <div style={styles.footerGrid}>
                        <div style={styles.footerCol}>
                            <h3 style={styles.footerLogo}>EventSphere</h3>
                            <p style={styles.footerText}>Your trusted partner for world-class event management solutions.</p>
                        </div>
                        <div style={styles.footerCol}>
                            <h4 style={styles.footerHeading}>Quick Links</h4>
                            <ul style={styles.footerLinks}>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/events">Events</Link></li>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/contact">Contact</Link></li>
                            </ul>
                        </div>
                        <div style={styles.footerCol}>
                            <h4 style={styles.footerHeading}>For Users</h4>
                            <ul style={styles.footerLinks}>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/register">Register</Link></li>
                                <li><Link to="/dashboard">Dashboard</Link></li>
                            </ul>
                        </div>
                        <div style={styles.footerCol}>
                            <h4 style={styles.footerHeading}>Connect</h4>
                            <ul style={styles.footerLinks}>
                                <li><a href="#">Twitter</a></li>
                                <li><a href="#">LinkedIn</a></li>
                                <li><a href="#">Instagram</a></li>
                            </ul>
                        </div>
                    </div>
                    <div style={styles.footerBottom}>
                        <p>© 2026 EventSphere. All rights reserved. Built with ❤️ for event professionals.</p>
                    </div>
                </div>
            </footer>

            {/* BACK TO TOP BUTTON */}
            <button id="backTop" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={styles.backTop}>
                ↑
            </button>
        </div>
    );
};

const styles = {
    page: { fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", background: '#f8fafc', minHeight: '100vh' },
    
    // Hero
    hero: { position: 'relative', minHeight: '90vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', display: 'flex', alignItems: 'center', overflow: 'hidden' },
    heroOverlay: { position: 'absolute', inset: 0, backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(255,107,53,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,107,53,0.1) 0%, transparent 60%)` },
    heroContent: { position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center' },
    heroBadge: { display: 'inline-block', background: 'rgba(255,107,53,0.2)', border: '1px solid rgba(255,107,53,0.4)', color: '#ff6b35', fontSize: '13px', fontWeight: '600', padding: '6px 18px', borderRadius: '100px', marginBottom: '28px' },
    heroTitle: { fontSize: 'clamp(36px, 8vw, 72px)', fontWeight: '900', color: 'white', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-2px' },
    heroTitleAccent: { background: 'linear-gradient(135deg, #ff6b35, #ff8c42)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    heroSubtext: { fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.7' },
    heroButtons: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' },
    btnPrimary: { background: '#ff6b35', color: 'white', textDecoration: 'none', padding: '14px 32px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', transition: 'all 0.2s', display: 'inline-block', border: 'none', cursor: 'pointer' },
    btnSecondary: { background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', textDecoration: 'none', padding: '14px 32px', borderRadius: '12px', fontWeight: '600', fontSize: '15px', transition: 'all 0.2s', display: 'inline-block', cursor: 'pointer' },
    
    // Stats
    statsSection: { background: 'white', padding: '40px 24px', borderBottom: '1px solid #e2e8f0' },
    statsContainer: { maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', textAlign: 'center' },
    statNum: { fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '900', color: '#ff6b35', lineHeight: '1' },
    statLabel: { fontSize: '13px', color: '#64748b', fontWeight: '500', marginTop: '8px' },
    
    // Sections
    container: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px' },
    sectionLight: { padding: 'clamp(60px, 8vw, 100px) 0', background: '#f8fafc' },
    sectionDark: { padding: 'clamp(60px, 8vw, 100px) 0', background: '#0f172a' },
    sectionHeader: { textAlign: 'center', marginBottom: '48px' },
    sectionBadge: { display: 'inline-block', background: 'rgba(255,107,53,0.1)', color: '#ff6b35', fontSize: '12px', fontWeight: '700', padding: '5px 14px', borderRadius: '100px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' },
    sectionTitle: { fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: '800', color: '#0f172a', marginBottom: '16px', letterSpacing: '-1px' },
    sectionSubtext: { fontSize: '16px', color: '#64748b', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' },
    
    // Events Grid
    eventsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px', marginBottom: '40px' },
    eventCard: { background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', transition: 'all 0.3s', cursor: 'pointer' },
    eventImageWrapper: { position: 'relative', height: '220px', overflow: 'hidden' },
    eventImage: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' },
    eventCategory: { position: 'absolute', top: '12px', left: '12px', background: '#ff6b35', color: 'white', fontSize: '12px', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' },
    eventBody: { padding: '20px' },
    eventTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' },
    eventMeta: { display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#64748b', marginBottom: '16px' },
    eventFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' },
    eventPrice: { fontSize: '20px', fontWeight: '800', color: '#ff6b35' },
    eventBtn: { color: '#ff6b35', textDecoration: 'none', fontWeight: '600', fontSize: '14px' },
    viewAllWrapper: { textAlign: 'center' },
    viewAllBtn: { display: 'inline-block', background: 'transparent', border: '2px solid #ff6b35', color: '#ff6b35', padding: '12px 32px', borderRadius: '40px', textDecoration: 'none', fontWeight: '600', transition: 'all 0.3s' },
    
    // Services
    servicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' },
    serviceCard: { background: '#1e1e2e', padding: '32px 24px', borderRadius: '20px', textAlign: 'center', border: '1px solid #2d2d3d', transition: 'all 0.3s' },
    serviceIcon: { fontSize: '48px', marginBottom: '20px' },
    serviceTitle: { fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '12px' },
    serviceDesc: { fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' },
    
    // Tickets
    ticketsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' },
    ticketCard: { background: 'white', borderRadius: '20px', padding: '32px 24px', textAlign: 'center', border: '1px solid #e2e8f0', transition: 'all 0.3s', position: 'relative' },
    ticketCardPopular: { border: '2px solid #ff6b35', transform: 'scale(1.02)' },
    popularBadge: { position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#ff6b35', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
    ticketName: { fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' },
    ticketPrice: { marginBottom: '24px' },
    ticketPriceNum: { fontSize: '42px', fontWeight: '900', color: '#ff6b35' },
    ticketPricePeriod: { fontSize: '14px', color: '#64748b' },
    ticketFeatures: { listStyle: 'none', padding: 0, margin: '0 0 28px 0' },
    ticketFeature: { padding: '8px 0', color: '#475569', fontSize: '14px', borderBottom: '1px solid #f1f5f9' },
    ticketBtn: { display: 'inline-block', background: '#ff6b35', color: 'white', padding: '12px 32px', borderRadius: '40px', textDecoration: 'none', fontWeight: '600', transition: 'all 0.3s' },
    ticketBtnPopular: { background: '#ff6b35', boxShadow: '0 4px 15px rgba(255,107,53,0.3)' },
    
    // About
    aboutSection: { padding: 'clamp(60px, 8vw, 100px) 0', background: 'white' },
    aboutGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'center' },
    aboutContent: { paddingRight: '30px' },
    aboutText: { fontSize: '15px', color: '#475569', lineHeight: '1.7', marginBottom: '20px' },
    aboutFeatures: { display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '24px' },
    aboutFeature: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: '#0f172a' },
    aboutFeatureIcon: { fontSize: '16px' },
    aboutImage: { borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' },
    aboutImg: { width: '100%', height: 'auto', display: 'block' },
    
    // CTA
    ctaSection: { padding: 'clamp(60px, 8vw, 100px) 24px', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' },
    ctaContainer: { maxWidth: '800px', margin: '0 auto' },
    ctaContent: { textAlign: 'center' },
    ctaTitle: { fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: '900', color: 'white', marginBottom: '20px' },
    ctaSubtext: { fontSize: '16px', color: 'rgba(255,255,255,0.7)', marginBottom: '32px', lineHeight: '1.7' },
    ctaBtn: { display: 'inline-block', background: '#ff6b35', color: 'white', padding: '14px 36px', borderRadius: '40px', textDecoration: 'none', fontWeight: '700', fontSize: '16px', transition: 'all 0.3s' },
    
    // Footer
    footer: { background: '#0f172a', padding: '60px 0 30px', borderTop: '1px solid rgba(255,255,255,0.1)' },
    footerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' },
    footerCol: {},
    footerLogo: { fontSize: '24px', fontWeight: '800', color: '#ff6b35', marginBottom: '16px' },
    footerText: { fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' },
    footerHeading: { fontSize: '16px', fontWeight: '700', color: 'white', marginBottom: '20px' },
    footerLinks: { listStyle: 'none', padding: 0 },
    footerBottom: { textAlign: 'center', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: '13px' },
    
    // Back to Top
    backTop: { position: 'fixed', bottom: '30px', right: '30px', display: 'none', width: '45px', height: '45px', background: '#ff6b35', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '20px', justifyContent: 'center', alignItems: 'center', transition: 'all 0.3s', zIndex: 1000, boxShadow: '0 4px 15px rgba(255,107,53,0.3)' },
    
    loading: { textAlign: 'center', padding: '40px', fontSize: '16px', color: '#64748b' }
};

export default Home;