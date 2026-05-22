import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '',
        confirmPassword: '', role: 'attendee',
        phone: '', companyName: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        setLoading(true);
        try {
            await register(formData);
            toast.success("Registration successful! Please login.");
            navigate('/login');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        { value: 'attendee', label: '🎟️ Attendee', desc: 'Browse & book sessions' },
        { value: 'exhibitor', label: '🏢 Exhibitor', desc: 'Showcase your business' },
        { value: 'organizer', label: '⚙️ Organizer', desc: 'Manage expos & events' },
    ];

    const focusInput = (e) => { e.target.style.border = '1.5px solid #6366f1'; e.target.style.background = 'white'; };
    const blurInput = (e) => { e.target.style.border = '1.5px solid #e2e8f0'; e.target.style.background = '#f8fafc'; };

    return (
        <>
            <style>{`
                * { box-sizing: border-box; margin: 0; padding: 0; }

                .reg-page {
                    min-height: 100vh;
                    display: flex;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    background: #f8fafc;
                }

                /* ── LEFT PANEL ── */
                .reg-left {
                    flex: 1;
                    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 60px;
                    position: relative;
                    overflow: hidden;
                }
                .reg-left-bg {
                    position: absolute;
                    inset: 0;
                    background-image:
                        radial-gradient(ellipse at 20% 30%, rgba(99,102,241,0.25) 0%, transparent 60%),
                        radial-gradient(ellipse at 80% 70%, rgba(139,92,246,0.2) 0%, transparent 50%);
                }
                .reg-left-content {
                    position: relative;
                    z-index: 1;
                    max-width: 440px;
                }
                .reg-logo-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 56px;
                }
                .reg-logo-box {
                    width: 44px; height: 44px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 900; font-size: 16px; color: white;
                    box-shadow: 0 0 24px rgba(99,102,241,0.5);
                    flex-shrink: 0;
                }
                .reg-logo-text {
                    font-size: 22px; font-weight: 800;
                    color: white; letter-spacing: -0.5px;
                }
                .reg-logo-span { color: #818cf8; }
                .reg-left-title {
                    font-size: 40px; font-weight: 900;
                    color: white; line-height: 1.1;
                    letter-spacing: -1.5px; margin-bottom: 16px;
                }
                .reg-gradient {
                    background: linear-gradient(135deg, #818cf8, #c084fc);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .reg-left-sub {
                    font-size: 15px; color: rgba(255,255,255,0.5);
                    line-height: 1.7; margin-bottom: 48px;
                }
                .reg-step-list { display: flex; flex-direction: column; }
                .reg-step {
                    display: flex; gap: 16px;
                    padding-bottom: 28px; position: relative;
                }
                .reg-step-line {
                    position: absolute; left: 17px; top: 36px;
                    width: 2px; height: calc(100% - 8px);
                    background: rgba(99,102,241,0.3);
                }
                .reg-step-num {
                    width: 36px; height: 36px; border-radius: 50%;
                    background: rgba(99,102,241,0.2);
                    border: 1px solid rgba(99,102,241,0.4);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 13px; font-weight: 700; color: #818cf8;
                    flex-shrink: 0;
                }
                .reg-step-text { padding-top: 8px; }
                .reg-step-title { font-size: 14px; font-weight: 700; color: white; margin-bottom: 2px; }
                .reg-step-desc { font-size: 12px; color: rgba(255,255,255,0.4); }

                /* ── RIGHT PANEL ── */
                .reg-right {
                    width: 520px;
                    background: white;
                    display: flex; flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 48px;
                    overflow-y: auto;
                }
                .reg-form-inner {
                    width: 100%;
                    max-width: 420px;
                }
                .reg-form-title {
                    font-size: 26px; font-weight: 800;
                    color: #0f172a; margin-bottom: 6px;
                    letter-spacing: -0.5px;
                }
                .reg-form-sub { font-size: 13px; color: #94a3b8; margin-bottom: 32px; }

                .reg-label {
                    display: block; font-size: 12px; font-weight: 700;
                    color: #374151; margin-bottom: 6px;
                    text-transform: uppercase; letter-spacing: 0.04em;
                }
                .reg-input {
                    width: 100%; padding: 12px 14px;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 10px; font-size: 14px;
                    color: #0f172a; outline: none;
                    transition: all 0.2s;
                    background: #f8fafc; margin-bottom: 16px;
                    font-family: inherit;
                }
                .reg-select {
                    width: 100%; padding: 12px 14px;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 10px; font-size: 14px;
                    color: #0f172a; outline: none;
                    background: #f8fafc; margin-bottom: 16px;
                    cursor: pointer;
                }
                .reg-grid2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }
                .reg-role-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 8px; margin-bottom: 16px;
                }
                .reg-role-btn {
                    padding: 12px 8px; border-radius: 10px;
                    border: 1.5px solid #e2e8f0;
                    cursor: pointer; text-align: center;
                    transition: all 0.2s; background: #f8fafc;
                }
                .reg-role-btn.active {
                    border-color: #6366f1;
                    background: #f5f3ff;
                }
                .reg-role-label {
                    font-size: 13px; font-weight: 700;
                    color: #0f172a; display: block;
                }
                .reg-role-desc { font-size: 10px; color: #94a3b8; margin-top: 2px; }

                .reg-pass-wrap { position: relative; }
                .reg-toggle-btn {
                    position: absolute; right: 12px; top: 13px;
                    background: none; border: none;
                    cursor: pointer; font-size: 15px; color: #94a3b8;
                }
                .reg-submit-btn {
                    width: 100%; padding: 14px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white; border: none;
                    border-radius: 12px; font-size: 15px;
                    font-weight: 700; cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 20px rgba(99,102,241,0.3);
                    margin-top: 4px; margin-bottom: 20px;
                    font-family: inherit;
                }
                .reg-submit-btn:hover:not(:disabled) { transform: translateY(-1px); }
                .reg-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

                .reg-login-row { text-align: center; font-size: 13px; color: #94a3b8; }
                .reg-login-link { color: #6366f1; font-weight: 700; text-decoration: none; }

                /* ── MOBILE HEADER (hidden on desktop) ── */
                .reg-mobile-header {
                    display: none;
                    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
                    padding: 20px 24px;
                    align-items: center;
                    gap: 12px;
                }
                .reg-mobile-header .reg-logo-text { font-size: 18px; }

                /* ── RESPONSIVE ── */

                /* Tablet */
                @media (max-width: 1024px) {
                    .reg-left { padding: 40px; }
                    .reg-left-title { font-size: 32px; }
                    .reg-right { width: 460px; padding: 40px 32px; }
                }

                /* Mobile */
                @media (max-width: 768px) {
                    .reg-page { flex-direction: column; background: white; }
                    .reg-left { display: none; }
                    .reg-mobile-header { display: flex; }
                    .reg-right {
                        width: 100%;
                        min-height: calc(100vh - 64px);
                        padding: 32px 24px 48px;
                        justify-content: flex-start;
                        align-items: center;
                    }
                    .reg-form-inner { max-width: 100%; }
                    .reg-form-title { font-size: 22px; }
                    .reg-role-grid { grid-template-columns: repeat(3, 1fr); gap: 6px; }
                    .reg-role-btn { padding: 10px 6px; }
                    .reg-role-label { font-size: 11px; }
                    .reg-role-desc { font-size: 9px; }
                    .reg-grid2 { grid-template-columns: 1fr; gap: 0; }
                }

                /* Small phones */
                @media (max-width: 380px) {
                    .reg-right { padding: 24px 16px 40px; }
                    .reg-role-grid { grid-template-columns: 1fr; }
                    .reg-role-btn { padding: 10px 12px; text-align: left; display: flex; align-items: center; gap: 8px; }
                    .reg-role-label { font-size: 13px; }
                    .reg-role-desc { font-size: 11px; margin-top: 0; }
                }
            `}</style>

            <div className="reg-page">

                {/* Mobile Header — shown only on small screens */}
                <div className="reg-mobile-header">
                    <div className="reg-logo-box">ES</div>
                    <span className="reg-logo-text">
                        Event<span className="reg-logo-span">Sphere</span>
                    </span>
                </div>

                {/* Left Panel */}
                <div className="reg-left">
                    <div className="reg-left-bg" />
                    <div className="reg-left-content">
                        <div className="reg-logo-row">
                            <div className="reg-logo-box">ES</div>
                            <span className="reg-logo-text">
                                Event<span className="reg-logo-span">Sphere</span>
                            </span>
                        </div>
                        <h1 className="reg-left-title">
                            Join the<br />
                            <span className="reg-gradient">Community</span>
                        </h1>
                        <p className="reg-left-sub">
                            Create your account and start managing world-class expo experiences today.
                        </p>
                        <div className="reg-step-list">
                            {[
                                { num: '1', title: 'Create your account', desc: 'Fill in your details and choose your role' },
                                { num: '2', title: 'Set up your profile', desc: 'Add your company info and preferences' },
                                { num: '3', title: 'Start exploring', desc: 'Browse expos, apply for booths, book sessions' },
                            ].map((step, i) => (
                                <div key={i} className="reg-step">
                                    {i < 2 && <div className="reg-step-line" />}
                                    <div className="reg-step-num">{step.num}</div>
                                    <div className="reg-step-text">
                                        <div className="reg-step-title">{step.title}</div>
                                        <div className="reg-step-desc">{step.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="reg-right">
                  <div className="reg-form-inner">
                    <h2 className="reg-form-title">Create Account</h2>
                    <p className="reg-form-sub">Join EventSphere and start your journey</p>

                    <form onSubmit={handleSubmit}>
                        {/* Role Selector */}
                        <label className="reg-label">I am a...</label>
                        <div className="reg-role-grid">
                            {roles.map(role => (
                                <div
                                    key={role.value}
                                    onClick={() => setFormData({ ...formData, role: role.value })}
                                    className={`reg-role-btn${formData.role === role.value ? ' active' : ''}`}
                                >
                                    <span className="reg-role-label">{role.label}</span>
                                    <span className="reg-role-desc">{role.desc}</span>
                                </div>
                            ))}
                        </div>

                        {/* Name */}
                        <label className="reg-label">Full Name</label>
                        <input
                            type="text" name="name" value={formData.name}
                            onChange={handleChange} required
                            placeholder="John Doe"
                            className="reg-input"
                            onFocus={focusInput} onBlur={blurInput}
                        />

                        {/* Email */}
                        <label className="reg-label">Email Address</label>
                        <input
                            type="email" name="email" value={formData.email}
                            onChange={handleChange} required
                            placeholder="you@example.com"
                            className="reg-input"
                            onFocus={focusInput} onBlur={blurInput}
                        />

                        {/* Phone & Company */}
                        <div className="reg-grid2">
                            <div>
                                <label className="reg-label">Phone</label>
                                <input
                                    type="tel" name="phone" value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="03001234567"
                                    className="reg-input"
                                    onFocus={focusInput} onBlur={blurInput}
                                />
                            </div>
                            <div>
                                <label className="reg-label">Company</label>
                                <input
                                    type="text" name="companyName" value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="Optional"
                                    className="reg-input"
                                    onFocus={focusInput} onBlur={blurInput}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <label className="reg-label">Password</label>
                        <div className="reg-pass-wrap">
                            <input
                                type={showPass ? 'text' : 'password'}
                                name="password" value={formData.password}
                                onChange={handleChange} required
                                placeholder="Min 6 characters"
                                className="reg-input"
                                style={{ paddingRight: '40px' }}
                                onFocus={focusInput} onBlur={blurInput}
                            />
                            <button type="button" className="reg-toggle-btn" onClick={() => setShowPass(!showPass)}>
                                {showPass ? '🙈' : '👁️'}
                            </button>
                        </div>

                        {/* Confirm Password */}
                        <label className="reg-label">Confirm Password</label>
                        <input
                            type="password" name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange} required
                            placeholder="Repeat password"
                            className="reg-input"
                            onFocus={focusInput} onBlur={blurInput}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="reg-submit-btn"
                        >
                            {loading ? '⏳ Creating Account...' : 'Create Account →'}
                        </button>

                        <div className="reg-login-row">
                            Already have an account?{' '}
                            <Link to="/login" className="reg-login-link">Sign In</Link>
                        </div>
                    </form>
                  </div>
                </div>
            </div>
        </>
    );
};

export default Register;