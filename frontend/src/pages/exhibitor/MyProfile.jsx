import { useState, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

/* ─── tiny hook: tracks viewport width without a library ─── */
function useIsMobile(breakpoint = 600) {
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== 'undefined' && window.innerWidth < breakpoint
    );
    useState(() => {
        const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    });
    return isMobile;
}

const MyProfile = () => {
    const { user } = useContext(AuthContext);
    const isMobile = useIsMobile();

    const [formData, setFormData] = useState({
        name       : user?.name        || '',
        email      : user?.email       || '',
        phone      : user?.phone       || '',
        companyName: user?.companyName || '',
    });
    const [focusedField, setFocusedField] = useState(null);

    const handleChange = useCallback((name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.info('Profile update coming soon!');
    };

    /* ─── avatar initial — safe even if name is undefined ─── */
    const avatarInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

    const s = {
        wrapper: {
            maxWidth: '680px',
            margin: '0 auto',
            padding: isMobile ? '0 12px' : '0',
        },

        pageTitle: {
            fontSize: isMobile ? '18px' : '22px',
            fontWeight: '900',
            color: '#0f172a',
            letterSpacing: '-0.5px',
            margin: '0 0 24px 0',
        },

        card: {
            background: 'white',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
        },

        avatarSection: {
            display: 'flex',
            alignItems: isMobile ? 'flex-start' : 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '12px' : '16px',
            padding: isMobile ? '20px' : '24px 28px',
            borderBottom: '1px solid #f1f5f9',
            background: 'linear-gradient(135deg, #0f172a, #1e1b4b)',
            position: 'relative',
            overflow: 'hidden',
        },
        avatarBg: {
            position: 'absolute', inset: 0,
            backgroundImage:
                'radial-gradient(ellipse at 90% 50%, rgba(99,102,241,0.2) 0%, transparent 60%)',
        },
        avatar: {
            width: isMobile ? '52px' : '64px',
            height: isMobile ? '52px' : '64px',
            flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '900',
            fontSize: isMobile ? '22px' : '26px',
            color: 'white',
            boxShadow: '0 0 20px rgba(99,102,241,0.4)',
            position: 'relative', zIndex: 1,
        },
        avatarInfo: { position: 'relative', zIndex: 1 },
        avatarName : {
            fontSize: isMobile ? '15px' : '17px',
            fontWeight: '800', color: 'white', margin: '0 0 2px 0',
        },
        avatarEmail: {
            fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '0 0 8px 0',
            wordBreak: 'break-all',          /* long emails don't overflow */
        },
        roleBadge: {
            display: 'inline-block',
            background: 'rgba(99,102,241,0.2)',
            border: '1px solid rgba(99,102,241,0.4)',
            color: '#a5b4fc', fontSize: '10px',
            fontWeight: '700', padding: '3px 10px',
            borderRadius: '100px', textTransform: 'capitalize',
            letterSpacing: '0.05em',
        },

        formBody: { padding: isMobile ? '16px' : '28px' },

        /* single-column on mobile, two-column on desktop */
        grid2: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '16px',
            marginBottom: '16px',
        },

        fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
        label: {
            fontSize: '12px', fontWeight: '700', color: '#475569',
            textTransform: 'uppercase', letterSpacing: '0.05em',
        },

        submitBtn: {
            width: '100%', padding: '13px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', borderRadius: '12px',
            color: 'white', fontSize: '14px', fontWeight: '700',
            cursor: 'pointer', marginTop: '8px',
            transition: 'all 0.2s',
            boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
        },
    };

    /* input style as a plain function (not nested in s to avoid stale closure) */
    const inputStyle = (name, disabled) => ({
        width: '100%', padding: '10px 14px',
        border: focusedField === name ? '1.5px solid #6366f1' : '1.5px solid #e2e8f0',
        borderRadius: '10px',
        fontSize: '14px', fontWeight: '500',
        color: disabled ? '#94a3b8' : '#0f172a',
        background: disabled ? '#f8fafc' : 'white',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: focusedField === name ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
        boxSizing: 'border-box',
        cursor: disabled ? 'not-allowed' : 'text',
    });

    /* ─── Field defined OUTSIDE return so it's stable across renders ─── */
    const Field = ({ label, name, type = 'text', disabled }) => (
        <div style={s.fieldGroup}>
            <label style={s.label}>{label}</label>
            <input
                type={type}
                value={formData[name]}
                disabled={disabled}
                onChange={e => handleChange(name, e.target.value)}
                onFocus={() => !disabled && setFocusedField(name)}
                onBlur={() => setFocusedField(null)}
                style={inputStyle(name, disabled)}
            />
        </div>
    );

    return (
        <div style={s.wrapper}>
            <h2 style={s.pageTitle}>My Profile</h2>

            <div style={s.card}>

                {/* Avatar section */}
                <div style={s.avatarSection}>
                    <div style={s.avatarBg} />
                    <div style={s.avatar}>{avatarInitial}</div>
                    <div style={s.avatarInfo}>
                        <p style={s.avatarName}>{user?.name}</p>
                        <p style={s.avatarEmail}>{user?.email}</p>
                        <span style={s.roleBadge}>{user?.role}</span>
                    </div>
                </div>

                {/* Form */}
                <div style={s.formBody}>
                    <form onSubmit={handleSubmit}>
                        <div style={s.grid2}>
                            <Field label="Full Name"    name="name" />
                            <Field label="Email"        name="email" type="email" disabled />
                        </div>
                        <div style={s.grid2}>
                            <Field label="Phone"        name="phone" type="tel" />
                            <Field label="Company Name" name="companyName" />
                        </div>

                        <button
                            type="submit"
                            style={s.submitBtn}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.4)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.3)';
                            }}
                        >
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;