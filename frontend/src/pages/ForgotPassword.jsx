import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail]       = useState('');
    const [loading, setLoading]   = useState(false);
    const [sent, setSent]         = useState(false);
    const [error, setError]       = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setSent(true);
        } catch (err) {
            setError(err.response?.data?.message );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                * { box-sizing: border-box; margin: 0; padding: 0; }
                .fp-page {
                    min-height: 100vh;
                    display: flex;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    background: #0f172a;
                }

                /* ── LEFT ── */
                .fp-left {
                    flex: 1;
                    background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 60px;
                    position: relative;
                    overflow: hidden;
                }
                .fp-left-bg {
                    position: absolute; inset: 0;
                    background-image:
                        radial-gradient(ellipse at 30% 40%, rgba(99,102,241,0.2) 0%, transparent 60%),
                        radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.15) 0%, transparent 50%);
                }
                .fp-left-content { position: relative; z-index: 1; max-width: 480px; }
                .fp-logo-row {
                    display: flex; align-items: center;
                    gap: 12px; margin-bottom: 60px;
                }
                .fp-logo-box {
                    width: 44px; height: 44px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 900; font-size: 16px; color: white;
                    box-shadow: 0 0 24px rgba(99,102,241,0.5);
                    flex-shrink: 0;
                }
                .fp-logo-text { font-size: 22px; font-weight: 800; color: white; letter-spacing: -0.5px; }
                .fp-logo-span { color: #818cf8; }
                .fp-left-title {
                    font-size: clamp(32px, 4vw, 42px);
                    font-weight: 900; color: white;
                    line-height: 1.1; letter-spacing: -1.5px;
                    margin-bottom: 20px;
                }
                .fp-gradient {
                    background: linear-gradient(135deg, #818cf8, #c084fc);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .fp-left-sub {
                    font-size: 15px; color: rgba(255,255,255,0.5);
                    line-height: 1.7; margin-bottom: 48px;
                }
                .fp-step-list { display: flex; flex-direction: column; gap: 20px; }
                .fp-step-item { display: flex; align-items: flex-start; gap: 14px; }
                .fp-step-dot {
                    width: 36px; height: 36px; border-radius: 10px;
                    background: rgba(99,102,241,0.15);
                    border: 1px solid rgba(99,102,241,0.3);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 16px; flex-shrink: 0;
                }
                .fp-step-info {}
                .fp-step-title { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.85); margin-bottom: 2px; }
                .fp-step-desc  { font-size: 12px; color: rgba(255,255,255,0.4); line-height: 1.5; }

                /* ── RIGHT ── */
                .fp-right {
                    width: 460px;
                    background: white;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 52px 44px;
                    overflow-y: auto;
                }
                .fp-form-inner { width: 100%; max-width: 380px; }

                /* mobile logo */
                .fp-mobile-logo {
                    display: none; align-items: center;
                    gap: 10px; margin-bottom: 36px;
                }
                .fp-mobile-logo-box {
                    width: 38px; height: 38px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 900; font-size: 14px; color: white;
                }
                .fp-mobile-logo-text { font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
                .fp-mobile-logo-span { color: #6366f1; }

                /* icon circle */
                .fp-icon-circle {
                    width: 64px; height: 64px;
                    background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1));
                    border: 1.5px solid rgba(99,102,241,0.2);
                    border-radius: 18px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 28px; margin-bottom: 24px;
                }
                .fp-form-title {
                    font-size: 26px; font-weight: 800;
                    color: #0f172a; margin-bottom: 8px; letter-spacing: -0.5px;
                }
                .fp-form-sub { font-size: 14px; color: #94a3b8; margin-bottom: 32px; line-height: 1.6; }

                .fp-label {
                    display: block; font-size: 12px; font-weight: 700;
                    color: #374151; margin-bottom: 7px;
                    text-transform: uppercase; letter-spacing: 0.04em;
                }
                .fp-input-wrap { position: relative; margin-bottom: 20px; }
                .fp-input {
                    width: 100%; padding: 13px 16px;
                    border: 1.5px solid #e2e8f0; border-radius: 12px;
                    font-size: 14px; color: #0f172a; outline: none;
                    transition: all 0.2s; background: #f8fafc;
                    font-family: inherit;
                }
                .fp-input:focus {
                    border-color: #6366f1; background: white;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
                }

                .fp-error {
                    background: rgba(239,68,68,0.08);
                    border: 1px solid rgba(239,68,68,0.2);
                    color: #dc2626; border-radius: 10px;
                    padding: 12px 14px; font-size: 13px;
                    font-weight: 500; margin-bottom: 16px;
                }

                .fp-submit-btn {
                    width: 100%; padding: 14px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white; border: none; border-radius: 12px;
                    font-size: 15px; font-weight: 700; cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 20px rgba(99,102,241,0.3);
                    font-family: inherit;
                }
                .fp-submit-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 24px rgba(99,102,241,0.4);
                }
                .fp-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

                .fp-back-link {
                    display: flex; align-items: center; justify-content: center;
                    gap: 6px; margin-top: 20px;
                    color: #6366f1; text-decoration: none;
                    font-size: 14px; font-weight: 600;
                    transition: gap 0.2s;
                }
                .fp-back-link:hover { gap: 10px; }

                /* success state */
                .fp-success {
                    text-align: center; padding: 8px 0;
                }
                .fp-success-icon {
                    width: 72px; height: 72px;
                    background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.1));
                    border: 1.5px solid rgba(16,185,129,0.3);
                    border-radius: 20px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 32px; margin: 0 auto 24px;
                }
                .fp-success-title {
                    font-size: 22px; font-weight: 800; color: #0f172a;
                    margin-bottom: 12px; letter-spacing: -0.5px;
                }
                .fp-success-text {
                    font-size: 14px; color: #64748b;
                    line-height: 1.7; margin-bottom: 32px;
                }
                .fp-success-email {
                    font-weight: 700; color: #6366f1;
                }
                .fp-resend-btn {
                    width: 100%; padding: 14px;
                    background: white; color: #6366f1;
                    border: 1.5px solid #6366f1; border-radius: 12px;
                    font-size: 14px; font-weight: 600; cursor: pointer;
                    transition: all 0.2s; font-family: inherit;
                    margin-bottom: 12px;
                }
                .fp-resend-btn:hover { background: #f5f3ff; }

                /* ── TABLET ── */
                @media (max-width: 1024px) {
                    .fp-left  { padding: 40px; }
                    .fp-right { width: 420px; padding: 40px 32px; }
                }
                /* ── MOBILE ── */
                @media (max-width: 768px) {
                    .fp-page  { background: white; }
                    .fp-left  { display: none; }
                    .fp-right {
                        width: 100%; min-height: 100vh;
                        padding: 48px 24px;
                        justify-content: center; align-items: center;
                    }
                    .fp-mobile-logo { display: flex; }
                }
                @media (max-width: 480px) {
                    .fp-right      { padding: 36px 20px; }
                    .fp-form-inner { max-width: 100%; }
                }
            `}</style>

            <div className="fp-page">
                {/* Left Panel */}
                <div className="fp-left">
                    <div className="fp-left-bg" />
                    <div className="fp-left-content">
                        <div className="fp-logo-row">
                            <div className="fp-logo-box">ES</div>
                            <span className="fp-logo-text">Event<span className="fp-logo-span">Sphere</span></span>
                        </div>
                        <h1 className="fp-left-title">
                            Forgot Your<br />
                            <span className="fp-gradient">Password?</span>
                        </h1>
                        <p className="fp-left-sub">
                            No worries — it happens to everyone. We'll send you a secure link to reset it in seconds.
                        </p>
                        <div className="fp-step-list">
                            {[
                                { icon: '📧', title: 'Enter your email',       desc: 'The one you registered your account with' },
                                { icon: '📬', title: 'Check your inbox',       desc: 'We\'ll send a reset link within moments' },
                                { icon: '🔑', title: 'Click the reset link',   desc: 'Opens a secure page to set your new password' },
                                { icon: '✅', title: 'Back in business',       desc: 'Log in with your new password right away' },
                            ].map((step, i) => (
                                <div key={i} className="fp-step-item">
                                    <div className="fp-step-dot">{step.icon}</div>
                                    <div className="fp-step-info">
                                        <div className="fp-step-title">{step.title}</div>
                                        <div className="fp-step-desc">{step.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="fp-right">
                    <div className="fp-form-inner">
                        {/* Mobile Logo */}
                        <div className="fp-mobile-logo">
                            <div className="fp-mobile-logo-box">ES</div>
                            <span className="fp-mobile-logo-text">Event<span className="fp-mobile-logo-span">Sphere</span></span>
                        </div>

                        {sent ? (
                            /* ── Success State ── */
                            <div className="fp-success">
                                <div className="fp-success-icon">📬</div>
                                <h2 className="fp-success-title">Check Your Inbox</h2>
                                <p className="fp-success-text">
                                    We've sent a password reset link to{' '}
                                    <span className="fp-success-email">{email}</span>.
                                    The link expires in <strong>15 minutes</strong>.
                                </p>
                                <button
                                    className="fp-resend-btn"
                                    onClick={() => { setSent(false); setEmail(''); }}
                                >
                                    Try a different email
                                </button>
                                <Link to="/login" className="fp-back-link">← Back to Sign In</Link>
                            </div>
                        ) : (
                            /* ── Form State ── */
                            <>
                                <div className="fp-icon-circle">🔐</div>
                                <h2 className="fp-form-title">Reset Password</h2>
                                <p className="fp-form-sub">
                                    Enter the email address linked to your account and we'll send you a reset link.
                                </p>

                                {error && <div className="fp-error">⚠️ {error}</div>}

                                <form onSubmit={handleSubmit}>
                                    <div className="fp-input-wrap">
                                        <label className="fp-label">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                            placeholder="you@example.com"
                                            className="fp-input"
                                        />
                                    </div>
                                    <button type="submit" disabled={loading} className="fp-submit-btn">
                                        {loading ? '⏳ Sending...' : 'Send Reset Link →'}
                                    </button>
                                </form>

                                <Link to="/login" className="fp-back-link" style={{ marginTop: '20px' }}>
                                    ← Back to Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;