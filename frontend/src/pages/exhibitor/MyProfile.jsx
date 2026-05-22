import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

function useIsMobile(breakpoint = 600) {

    const [isMobile, setIsMobile] = useState(
        window.innerWidth < breakpoint
    );

    useEffect(() => {

        const handleResize = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, [breakpoint]);

    return isMobile;
}

const MyProfile = () => {

    const { user } = useContext(AuthContext);

    const isMobile = useIsMobile();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        companyName: '',
    });

    const [focusedField, setFocusedField] = useState(null);

    useEffect(() => {

        if (user) {

            setFormData({
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                companyName: user?.companyName || '',
            });
        }

    }, [user]);

    const handleChange = useCallback((name, value) => {

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    }, []);

    const handleSubmit = (e) => {

        e.preventDefault();

        console.log(formData);

        toast.success('Profile Updated Successfully');

    };

    const avatarInitial = user?.name
        ? user.name.charAt(0).toUpperCase()
        : '?';

    const s = {

        wrapper: {
            maxWidth: '700px',
            margin: '0 auto',
            padding: isMobile ? '0 12px' : '0',
            fontFamily: 'Segoe UI, sans-serif',
        },

        title: {
            fontSize: isMobile ? '22px' : '28px',
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: '20px',
        },

        card: {
            background: '#ffffff',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        },

        topSection: {
            background: 'linear-gradient(135deg,#0f172a,#1e293b)',
            padding: isMobile ? '25px 20px' : '35px',
            display: 'flex',
            alignItems: isMobile ? 'flex-start' : 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '18px',
        },

        avatar: {
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '28px',
            fontWeight: '800',
            flexShrink: 0,
        },

        userName: {
            color: '#fff',
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '5px',
        },

        userEmail: {
            color: '#cbd5e1',
            fontSize: '14px',
            marginBottom: '10px',
            wordBreak: 'break-word',
        },

        role: {
            display: 'inline-block',
            padding: '6px 12px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.12)',
            color: '#fff',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'capitalize',
        },

        body: {
            padding: isMobile ? '20px' : '30px',
        },

        grid: {
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '18px',
            marginBottom: '18px',
        },

        field: {
            display: 'flex',
            flexDirection: 'column',
        },

        label: {
            fontSize: '13px',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#334155',
        },

        button: {
            width: '100%',
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            border: 'none',
            padding: '14px',
            borderRadius: '14px',
            color: '#fff',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '10px',
            transition: '0.2s',
        },
    };

    const inputStyle = (name, disabled) => ({

        width: '100%',
        padding: '13px 14px',
        borderRadius: '12px',

        border:
            focusedField === name
                ? '2px solid #6366f1'
                : '1.5px solid #e2e8f0',

        outline: 'none',
        fontSize: '14px',
        transition: '0.2s',
        background: disabled ? '#f8fafc' : '#fff',
        color: '#0f172a',

        boxShadow:
            focusedField === name
                ? '0 0 0 4px rgba(99,102,241,0.1)'
                : 'none',

        boxSizing: 'border-box',
    });

    return (

        <div style={s.wrapper}>

            <h2 style={s.title}>
                My Profile
            </h2>

            <div style={s.card}>

                <div style={s.topSection}>

                    <div style={s.avatar}>
                        {avatarInitial}
                    </div>

                    <div>

                        <div style={s.userName}>
                            {user?.name}
                        </div>

                        <div style={s.userEmail}>
                            {user?.email}
                        </div>

                        <div style={s.role}>
                            {user?.role}
                        </div>

                    </div>

                </div>

                <div style={s.body}>

                    <form onSubmit={handleSubmit}>

                        <div style={s.grid}>

                            <div style={s.field}>

                                <label style={s.label}>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        handleChange(
                                            'name',
                                            e.target.value
                                        )
                                    }
                                    onFocus={() =>
                                        setFocusedField('name')
                                    }
                                    onBlur={() =>
                                        setFocusedField(null)
                                    }
                                    style={inputStyle('name')}
                                />

                            </div>

                            <div style={s.field}>

                                <label style={s.label}>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    style={inputStyle('email', true)}
                                />

                            </div>

                        </div>

                        <div style={s.grid}>

                            <div style={s.field}>

                                <label style={s.label}>
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        handleChange(
                                            'phone',
                                            e.target.value
                                        )
                                    }
                                    onFocus={() =>
                                        setFocusedField('phone')
                                    }
                                    onBlur={() =>
                                        setFocusedField(null)
                                    }
                                    style={inputStyle('phone')}
                                />

                            </div>

                            <div style={s.field}>

                                <label style={s.label}>
                                    Company Name
                                </label>

                                <input
                                    type="text"
                                    value={formData.companyName}
                                    onChange={(e) =>
                                        handleChange(
                                            'companyName',
                                            e.target.value
                                        )
                                    }
                                    onFocus={() =>
                                        setFocusedField('companyName')
                                    }
                                    onBlur={() =>
                                        setFocusedField(null)
                                    }
                                    style={inputStyle('companyName')}
                                />

                            </div>

                        </div>

                        <button
                            type="submit"
                            style={s.button}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                    'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                    'translateY(0px)';
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