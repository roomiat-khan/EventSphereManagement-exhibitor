import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const { token }                       = useParams();
    const navigate                        = useNavigate();
    const [password, setPassword]         = useState('');
    const [confirm, setConfirm]           = useState('');
    const [showPass, setShowPass]         = useState(false);
    const [showConfirm, setShowConfirm]   = useState(false);
    const [loading, setLoading]           = useState(false);
    const [done, setDone]                 = useState(false);
    const [error, setError]               = useState('');

    /* simple strength meter */
    const getStrength = (p) => {
        if (!p) return null;
        let score = 0;
        if (p.length >= 8)              score++;
        if (/[A-Z]/.test(p))            score++;
        if (/[0-9]/.test(p))            score++;
        if (/[^A-Za-z0-9]/.test(p))     score++;
        if (score <= 1) return { label: 'Weak',   color: '#ef4444', width: '25%' };
        if (score === 2) return { label: 'Fair',   color: '#f59e0b', width: '50%' };
        if (score === 3) return { label: 'Good',   color: '#6366f1', width: '75%' };
        return              { label: 'Strong', color: '#10b981', width: '100%' };
    };
    const strength = getStrength(password);

   const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
        setError('Passwords do not match.');
        return;
    }

    if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
    }

    setLoading(true);

    try {

        const response = await axios.post(
            `http://localhost:5000/api/auth/reset-password/${token}`,
            { password }
        );

        console.log(response.data);

        setDone(true);

        // Optional auto redirect after 2 sec
        setTimeout(() => {
            navigate('/login');
        }, 2000);

    } catch (err) {

        console.log(err);

        setError(
            err.response?.data?.message ||
            'Something went wrong. Please try again.'
        );

    } finally {
        setLoading(false);
    }
};

    return (
        <>
            <style>{`
                * { box-sizing: border-box; margin: 0; padding: 0; }
                .rp-page {
                    min-height: 100vh;
                    display: flex;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    background: #0f172a;
                }

                /* ── LEFT ── */
                .rp-left {
                    flex: 1;
                    background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
                    display: flex; flex-direction: column;
                    justify-content: center; padding: 60px;
                    position: relative; overflow: hidden;
                }
                .rp-left-bg {
                    position: absolute; inset: 0;
                    background-image:
                        radial-gradient(ellipse at 30% 40%, rgba(99,102,241,0.2) 0%, transparent 60%),
                        radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.15) 0%, transparent 50%);
                }
                .rp-left-content { position: relative; z-index: 1; max-width: 480px; }
                .rp-logo-row {
                    display: flex; align-items: center;
                    gap: 12px; margin-bottom: 60px;
                }
                .rp-logo-box {
                    width: 44px; height: 44px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 900; font-size: 16px; color: white;
                    box-shadow: 0 0 24px rgba(99,102,241,0.5); flex-shrink: 0;
                }
                .rp-logo-text { font-size: 22px; font-weight: 800; color: white; letter-spacing: -0.5px; }
                .rp-logo-span { color: #818cf8; }
                .rp-left-title {
                    font-size: clamp(32px, 4vw, 42px);
                    font-weight: 900; color: white;
                    line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 20px;
                }
                .rp-gradient {
                    background: linear-gradient(135deg, #818cf8, #c084fc);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .rp-left-sub {
                    font-size: 15px; color: rgba(255,255,255,0.5);
                    line-height: 1.7; margin-bottom: 48px;
                }
                .rp-tip-list { display: flex; flex-direction: column; gap: 14px; }
                .rp-tip-item { display: flex; align-items: center; gap: 12px; }
                .rp-tip-dot {
                    width: 32px; height: 32px; border-radius: 8px;
                    background: rgba(99,102,241,0.15);
                    border: 1px solid rgba(99,102,241,0.3);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 14px; flex-shrink: 0;
                }
                .rp-tip-text { font-size: 13px; color: rgba(255,255,255,0.55); font-weight: 500; }

                /* ── RIGHT ── */
                .rp-right {
                    width: 460px; background: white;
                    display: flex; flex-direction: column;
                    justify-content: center; align-items: center;
                    padding: 52px 44px; overflow-y: auto;
                }
                .rp-form-inner { width: 100%; max-width: 380px; }

                /* mobile logo */
                .rp-mobile-logo {
                    display: none; align-items: center;
                    gap: 10px; margin-bottom: 36px;
                }
                .rp-mobile-logo-box {
                    width: 38px; height: 38px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 900; font-size: 14px; color: white;
                }
                .rp-mobile-logo-text { font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
                .rp-mobile-logo-span { color: #6366f1; }

                .rp-icon-circle {
                    width: 64px; height: 64px;
                    background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1));
                    border: 1.5px solid rgba(99,102,241,0.2);
                    border-radius: 18px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 28px; margin-bottom: 24px;
                }
                .rp-form-title {
                    font-size: 26px; font-weight: 800; color: #0f172a;
                    margin-bottom: 8px; letter-spacing: -0.5px;
                }
                .rp-form-sub { font-size: 14px; color: #94a3b8; margin-bottom: 32px; line-height: 1.6; }

                .rp-label {
                    display: block; font-size: 12px; font-weight: 700;
                    color: #374151; margin-bottom: 7px;
                    text-transform: uppercase; letter-spacing: 0.04em;
                }
                .rp-input-wrap { position: relative; margin-bottom: 8px; }
                .rp-input {
                    width: 100%; padding: 13px 44px 13px 16px;
                    border: 1.5px solid #e2e8f0; border-radius: 12px;
                    font-size: 14px; color: #0f172a; outline: none;
                    transition: all 0.2s; background: #f8fafc;
                    font-family: inherit;
                }
                .rp-input:focus {
                    border-color: #6366f1; background: white;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
                }
                .rp-toggle-btn {
                    position: absolute; right: 14px; top: 50%;
                    transform: translateY(-50%);
                    background: none; border: none;
                    cursor: pointer; font-size: 16px; color: #94a3b8;
                }

                /* strength bar */
                .rp-strength-row {
                    display: flex; align-items: center;
                    gap: 10px; margin-bottom: 18px;
                }
                .rp-strength-bar-bg {
                    flex: 1; height: 4px; background: #e2e8f0;
                    border-radius: 999px; overflow: hidden;
                }
                .rp-strength-bar-fill {
                    height: 100%; border-radius: 999px;
                    transition: width 0.3s, background 0.3s;
                }
                .rp-strength-label {
                    font-size: 11px; font-weight: 700;
                    white-space: nowrap;
                }

                .rp-match-hint {
                    font-size: 12px; font-weight: 600;
                    margin-bottom: 18px; margin-top: -4px;
                }

                .rp-error {
                    background: rgba(239,68,68,0.08);
                    border: 1px solid rgba(239,68,68,0.2);
                    color: #dc2626; border-radius: 10px;
                    padding: 12px 14px; font-size: 13px;
                    font-weight: 500; margin-bottom: 16px;
                }
                .rp-submit-btn {
                    width: 100%; padding: 14px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white; border: none; border-radius: 12px;
                    font-size: 15px; font-weight: 700; cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 20px rgba(99,102,241,0.3);
                    font-family: inherit;
                }
                .rp-submit-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 24px rgba(99,102,241,0.4);
                }
                .rp-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

                /* success */
                .rp-success { text-align: center; padding: 8px 0; }
                .rp-success-icon {
                    width: 72px; height: 72px;
                    background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.1));
                    border: 1.5px solid rgba(16,185,129,0.3);
                    border-radius: 20px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 32px; margin: 0 auto 24px;
                }
                .rp-success-title {
                    font-size: 22px; font-weight: 800; color: #0f172a;
                    margin-bottom: 12px; letter-spacing: -0.5px;
                }
                .rp-success-text {
                    font-size: 14px; color: #64748b;
                    line-height: 1.7; margin-bottom: 32px;
                }
                .rp-login-btn {
                    display: block; width: 100%; padding: 14px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white; text-decoration: none;
                    border-radius: 12px; font-size: 15px; font-weight: 700;
                    text-align: center; transition: all 0.2s;
                    box-shadow: 0 4px 20px rgba(99,102,241,0.3);
                }
                .rp-login-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 24px rgba(99,102,241,0.4);
                }

                /* ── TABLET ── */
                @media (max-width: 1024px) {
                    .rp-left  { padding: 40px; }
                    .rp-right { width: 420px; padding: 40px 32px; }
                }
                /* ── MOBILE ── */
                @media (max-width: 768px) {
                    .rp-page  { background: white; }
                    .rp-left  { display: none; }
                    .rp-right {
                        width: 100%; min-height: 100vh;
                        padding: 48px 24px;
                        justify-content: center; align-items: center;
                    }
                    .rp-mobile-logo { display: flex; }
                }
                @media (max-width: 480px) {
                    .rp-right      { padding: 36px 20px; }
                    .rp-form-inner { max-width: 100%; }
                }
            `}</style>

            <div className="rp-page">
                {/* Left Panel */}
                <div className="rp-left">
                    <div className="rp-left-bg" />
                    <div className="rp-left-content">
                        <div className="rp-logo-row">
                            <div className="rp-logo-box">ES</div>
                            <span className="rp-logo-text">Event<span className="rp-logo-span">Sphere</span></span>
                        </div>
                        <h1 className="rp-left-title">
                            Set a New<br />
                            <span className="rp-gradient">Password</span>
                        </h1>
                        <p className="rp-left-sub">
                            Choose something strong. A good password keeps your account and your events safe.
                        </p>
                        <div className="rp-tip-list">
                            {[
                                { icon: '🔡', text: 'At least 8 characters long' },
                                { icon: '🔠', text: 'Mix of uppercase & lowercase letters' },
                                { icon: '🔢', text: 'Include at least one number' },
                                { icon: '💥', text: 'Add a special character (!@#$...)' },
                            ].map((tip, i) => (
                                <div key={i} className="rp-tip-item">
                                    <div className="rp-tip-dot">{tip.icon}</div>
                                    <span className="rp-tip-text">{tip.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="rp-right">
                    <div className="rp-form-inner">
                        {/* Mobile Logo */}
                        <div className="rp-mobile-logo">
                            <div className="rp-mobile-logo-box">ES</div>
                            <span className="rp-mobile-logo-text">Event<span className="rp-mobile-logo-span">Sphere</span></span>
                        </div>

                        {done ? (
                            /* ── Success State ── */
                            <div className="rp-success">
                                <div className="rp-success-icon">🎉</div>
                                <h2 className="rp-success-title">Password Reset!</h2>
                                <p className="rp-success-text">
                                    Your password has been updated successfully.
                                    You can now sign in with your new credentials.
                                </p>
                                <Link to="/login" className="rp-login-btn">
                                    Sign In →
                                </Link>
                            </div>
                        ) : (
                            /* ── Form State ── */
                            <>
                                <div className="rp-icon-circle">🔑</div>
                                <h2 className="rp-form-title">New Password</h2>
                                <p className="rp-form-sub">
                                    Enter and confirm your new password below.
                                </p>

                                {error && <div className="rp-error">⚠️ {error}</div>}

                                <form onSubmit={handleSubmit}>
                                    {/* New Password */}
                                    <label className="rp-label">New Password</label>
                                    <div className="rp-input-wrap">
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                            placeholder="••••••••"
                                            className="rp-input"
                                        />
                                        <button type="button" className="rp-toggle-btn" onClick={() => setShowPass(p => !p)}>
                                            {showPass ? '🙈' : '👁️'}
                                        </button>
                                    </div>

                                    {/* Strength bar */}
                                    {strength && (
                                        <div className="rp-strength-row">
                                            <div className="rp-strength-bar-bg">
                                                <div
                                                    className="rp-strength-bar-fill"
                                                    style={{ width: strength.width, background: strength.color }}
                                                />
                                            </div>
                                            <span className="rp-strength-label" style={{ color: strength.color }}>
                                                {strength.label}
                                            </span>
                                        </div>
                                    )}
                                    {!strength && <div style={{ marginBottom: '18px' }} />}

                                    {/* Confirm Password */}
                                    <label className="rp-label">Confirm Password</label>
                                    <div className="rp-input-wrap">
                                        <input
                                            type={showConfirm ? 'text' : 'password'}
                                            value={confirm}
                                            onChange={e => setConfirm(e.target.value)}
                                            required
                                            placeholder="••••••••"
                                            className="rp-input"
                                        />
                                        <button type="button" className="rp-toggle-btn" onClick={() => setShowConfirm(p => !p)}>
                                            {showConfirm ? '🙈' : '👁️'}
                                        </button>
                                    </div>

                                    {/* Match hint */}
                                    {confirm && (
                                        <p className="rp-match-hint" style={{ color: password === confirm ? '#10b981' : '#ef4444' }}>
                                            {password === confirm ? '✅ Passwords match' : '❌ Passwords do not match'}
                                        </p>
                                    )}
                                    {!confirm && <div style={{ marginBottom: '18px' }} />}

                                    <button
                                        type="submit"
                                        disabled={loading || (confirm && password !== confirm)}
                                        className="rp-submit-btn"
                                    >
                                        {loading ? '⏳ Resetting...' : 'Reset Password →'}
                                    </button>
                                </form>

                                <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '20px', color: '#6366f1', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
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

export default ResetPassword;