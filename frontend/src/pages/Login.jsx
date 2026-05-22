import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const { login, getDashboardPath } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await login(email, password);
            navigate(getDashboardPath(user.role));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                * { box-sizing: border-box; margin: 0; padding: 0; }

                .login-page {
                    min-height: 100vh;
                    display: flex;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    background: #0f172a;
                }

                /* ── LEFT ── */
                .login-left {
                    flex: 1;
                    background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 60px;
                    position: relative;
                    overflow: hidden;
                }
                .login-left-bg {
                    position: absolute;
                    inset: 0;
                    background-image:
                        radial-gradient(ellipse at 30% 40%, rgba(99,102,241,0.2) 0%, transparent 60%),
                        radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.15) 0%, transparent 50%);
                }
                .login-left-content {
                    position: relative;
                    z-index: 1;
                    max-width: 480px;
                }
                .login-logo-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 60px;
                }
                .login-logo-box {
                    width: 44px; height: 44px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 900; font-size: 16px; color: white;
                    box-shadow: 0 0 24px rgba(99,102,241,0.5);
                    flex-shrink: 0;
                }
                .login-logo-text {
                    font-size: 22px; font-weight: 800;
                    color: white; letter-spacing: -0.5px;
                }
                .login-logo-span { color: #818cf8; }
                .login-left-title {
                    font-size: clamp(32px, 4vw, 42px);
                    font-weight: 900; color: white;
                    line-height: 1.1; letter-spacing: -1.5px;
                    margin-bottom: 20px;
                }
                .login-gradient {
                    background: linear-gradient(135deg, #818cf8, #c084fc);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .login-left-sub {
                    font-size: 15px; color: rgba(255,255,255,0.5);
                    line-height: 1.7; margin-bottom: 48px;
                }
                .login-feature-list { display: flex; flex-direction: column; gap: 16px; }
                .login-feature-item { display: flex; align-items: center; gap: 14px; }
                .login-feature-dot {
                    width: 36px; height: 36px; border-radius: 10px;
                    background: rgba(99,102,241,0.15);
                    border: 1px solid rgba(99,102,241,0.3);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 16px; flex-shrink: 0;
                }
                .login-feature-text {
                    font-size: 14px; color: rgba(255,255,255,0.65); font-weight: 500;
                }

                /* ── RIGHT ── */
                .login-right {
                    width: 460px;
                    background: white;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;          /* centers card horizontally */
                    padding: 52px 44px;
                    overflow-y: auto;
                }
                .login-form-inner {
                    width: 100%;
                    max-width: 380px;             /* card max width */
                }

                .login-mobile-logo {
                    display: none;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 36px;
                }
                .login-mobile-logo-box {
                    width: 38px; height: 38px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 900; font-size: 14px; color: white;
                }
                .login-mobile-logo-text {
                    font-size: 20px; font-weight: 800;
                    color: #0f172a; letter-spacing: -0.5px;
                }
                .login-mobile-logo-span { color: #6366f1; }

                .login-form-title {
                    font-size: 26px; font-weight: 800;
                    color: #0f172a; margin-bottom: 8px;
                    letter-spacing: -0.5px;
                }
                .login-form-sub { font-size: 14px; color: #94a3b8; margin-bottom: 36px; }

                .login-label {
                    display: block; font-size: 12px; font-weight: 700;
                    color: #374151; margin-bottom: 7px;
                    text-transform: uppercase; letter-spacing: 0.04em;
                }
                .login-input-wrap { position: relative; margin-bottom: 18px; }
                .login-input {
                    width: 100%; padding: 13px 16px;
                    border: 1.5px solid #e2e8f0; border-radius: 12px;
                    font-size: 14px; color: #0f172a; outline: none;
                    transition: all 0.2s; background: #f8fafc;
                    font-family: inherit;
                }
                .login-input:focus {
                    border-color: #6366f1;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
                }
                .login-toggle-btn {
                    position: absolute; right: 14px; top: 50%;
                    transform: translateY(-50%);
                    background: none; border: none;
                    cursor: pointer; font-size: 16px; color: #94a3b8;
                }
                .login-submit-btn {
                    width: 100%; padding: 14px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white; border: none; border-radius: 12px;
                    font-size: 15px; font-weight: 700; cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 20px rgba(99,102,241,0.3);
                    margin-top: 8px;
                    font-family: inherit;
                }
                .login-submit-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 24px rgba(99,102,241,0.4);
                }
                .login-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

                .login-divider {
                    display: flex; align-items: center;
                    gap: 16px; margin: 24px 0;
                }
                .login-divider-line { flex: 1; height: 1px; background: #e2e8f0; }
                .login-divider-text {
                    font-size: 12px; color: #94a3b8;
                    font-weight: 500; white-space: nowrap;
                }
                .login-register-link {
                    display: block; text-align: center; padding: 13px;
                    border: 1.5px solid #e2e8f0; border-radius: 12px;
                    color: #6366f1; text-decoration: none;
                    font-size: 14px; font-weight: 600; transition: all 0.2s;
                }
                .login-register-link:hover {
                    background: #f5f3ff;
                    border-color: #6366f1;
                }

                /* ── TABLET ── */
                @media (max-width: 1024px) {
                    .login-left { padding: 40px; }
                    .login-right { width: 420px; padding: 40px 32px; }
                }

                /* ── MOBILE ── */
                @media (max-width: 768px) {
                    .login-page { background: white; }
                    .login-left { display: none; }
                    .login-right {
                        width: 100%;
                        min-height: 100vh;
                        padding: 48px 24px;
                        justify-content: center;
                        align-items: center;
                    }
                    .login-mobile-logo { display: flex; }
                }

                @media (max-width: 480px) {
                    .login-right { padding: 36px 20px; }
                    .login-form-inner { max-width: 100%; }
                }
            `}</style>

            <div className="login-page">

                {/* Left Panel */}
                <div className="login-left">
                    <div className="login-left-bg" />
                    <div className="login-left-content">
                        <div className="login-logo-row">
                            <div className="login-logo-box">ES</div>
                            <span className="login-logo-text">
                                Event<span className="login-logo-span">Sphere</span>
                            </span>
                        </div>
                        <h1 className="login-left-title">
                            Welcome<br />
                            <span className="login-gradient">Back!</span>
                        </h1>
                        <p className="login-left-sub">
                            Sign in to manage your expos, booths, and sessions all in one place.
                        </p>
                        <div className="login-feature-list">
                            {[
                                { icon: '🎪', text: 'Manage large-scale expo events' },
                                { icon: '🏢', text: 'Real-time booth availability' },
                                { icon: '📅', text: 'Smart session scheduling' },
                                { icon: '📊', text: 'Analytics & reporting dashboard' },
                            ].map((f, i) => (
                                <div key={i} className="login-feature-item">
                                    <div className="login-feature-dot">{f.icon}</div>
                                    <span className="login-feature-text">{f.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="login-right">
                    <div className="login-form-inner">

                        {/* Mobile Logo */}
                        <div className="login-mobile-logo">
                            <div className="login-mobile-logo-box">ES</div>
                            <span className="login-mobile-logo-text">
                                Event<span className="login-mobile-logo-span">Sphere</span>
                            </span>
                        </div>

                        <h2 className="login-form-title">Sign In</h2>
                        <p className="login-form-sub">Enter your credentials to access your account</p>

                        <form onSubmit={handleSubmit}>
                            <div className="login-input-wrap">
                                <label className="login-label">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    placeholder="you@example.com"
                                    className="login-input"
                                />
                            </div>

                            <div className="login-input-wrap">
                                <label className="login-label">Password</label>
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="login-input"
                                    style={{ paddingRight: '44px' }}
                                />
                                <button
                                    type="button"
                                    className="login-toggle-btn"
                                    onClick={() => setShowPass(!showPass)}
                                >
                                    {showPass ? '🙈' : '👁️'}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="login-submit-btn"
                            >
                                {loading ? '⏳ Signing in...' : 'Sign In →'}
                            </button>
                        </form>

                        <div className="login-divider">
                            <div className="login-divider-line" />
                            <span className="login-divider-text">Don't have an account?</span>
                            <div className="login-divider-line" />
                        </div>
                        <Link to="/forgot-password" className="login-forgot-link">
                            Forgot Password?
                        </Link>    

                        <Link to="/register" className="login-register-link">
                            Create New Account
                        </Link>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;