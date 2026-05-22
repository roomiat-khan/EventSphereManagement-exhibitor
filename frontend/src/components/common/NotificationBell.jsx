import { useState, useEffect, useRef } from 'react';
import { getMyNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from '../../services/api';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await getMyNotifications();
            setNotifications(res.data);
        } catch {}
    };

    const handleRead = async (id) => {
        try {
            await markNotificationRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        } catch {}
    };

    const handleReadAll = async () => {
        try {
            await markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch {}
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        try {
            await deleteNotification(id);
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch {}
    };

    const unread = notifications.filter(n => !n.read).length;

    const typeConfig = {
        info:    { icon: 'ℹ️', color: '#6366f1', bg: 'rgba(99,102,241,0.08)'  },
        success: { icon: '✅', color: '#059669', bg: 'rgba(16,185,129,0.08)'  },
        warning: { icon: '⚠️', color: '#d97706', bg: 'rgba(245,158,11,0.08)'  },
        error:   { icon: '❌', color: '#dc2626', bg: 'rgba(239,68,68,0.08)'   },
    };

    const s = {
        wrap: { position: 'relative' },
        bellBtn: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', width: '38px', height: '38px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', position: 'relative', transition: 'all 0.2s' },
        badge: { position: 'absolute', top: '-6px', right: '-6px', background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0f172a' },
        dropdown: { position: 'absolute', top: '48px', right: 0, width: '360px', background: 'white', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', zIndex: 1000, overflow: 'hidden' },
        dropHead: { padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
        dropTitle: { fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 },
        readAllBtn: { fontSize: '12px', fontWeight: '700', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px' },
        list: { maxHeight: '360px', overflowY: 'auto' },
        item: (read) => ({ padding: '14px 20px', borderBottom: '1px solid #f8fafc', cursor: 'pointer', transition: 'background 0.15s', background: read ? 'white' : 'rgba(99,102,241,0.04)', display: 'flex', gap: '12px', alignItems: 'flex-start' }),
        itemIcon: (type) => ({ width: '36px', height: '36px', borderRadius: '10px', background: typeConfig[type]?.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }),
        itemContent: { flex: 1, minWidth: 0 },
        itemTitle: (read) => ({ fontSize: '13px', fontWeight: read ? '500' : '700', color: '#0f172a', margin: '0 0 2px 0' }),
        itemMsg: { fontSize: '12px', color: '#64748b', margin: '0 0 4px 0', lineHeight: '1.4' },
        itemTime: { fontSize: '11px', color: '#94a3b8' },
        deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#94a3b8', padding: '2px', flexShrink: 0 },
        unreadDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', flexShrink: 0, marginTop: '4px' },
        empty: { padding: '40px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' },
    };

    const timeAgo = (date) => {
        const diff = (new Date() - new Date(date)) / 1000;
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <div style={s.wrap} ref={ref}>
            <button style={s.bellBtn} onClick={() => setOpen(!open)}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
                🔔
                {unread > 0 && (
                    <span style={s.badge}>{unread > 9 ? '9+' : unread}</span>
                )}
            </button>

            {open && (
                <div style={s.dropdown}>
                    <div style={s.dropHead}>
                        <h3 style={s.dropTitle}>🔔 Notifications {unread > 0 && `(${unread})`}</h3>
                        {unread > 0 && (
                            <button style={s.readAllBtn} onClick={handleReadAll}>Mark all read</button>
                        )}
                    </div>

                    <div style={s.list}>
                        {notifications.length === 0 ? (
                            <div style={s.empty}>
                                <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔔</div>
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div key={n._id} style={s.item(n.read)}
                                    onClick={() => { if (!n.read) handleRead(n._id); }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseLeave={e => e.currentTarget.style.background = n.read ? 'white' : 'rgba(99,102,241,0.04)'}
                                >
                                    <div style={s.itemIcon(n.type)}>{typeConfig[n.type]?.icon}</div>
                                    <div style={s.itemContent}>
                                        <p style={s.itemTitle(n.read)}>{n.title}</p>
                                        <p style={s.itemMsg}>{n.message}</p>
                                        <span style={s.itemTime}>{timeAgo(n.createdAt)}</span>
                                    </div>
                                    {!n.read && <div style={s.unreadDot} />}
                                    <button style={s.deleteBtn} onClick={(e) => handleDelete(n._id, e)}>✕</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;