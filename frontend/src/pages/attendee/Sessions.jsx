import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
    getExpos,
    getSessionsByExpo,
    addBookmark,
    removeBookmark,
    checkBookmark
} from '../../services/api';

import { toast } from 'react-toastify';

const Sessions = () => {

    const [expos, setExpos] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [selectedExpo, setSelectedExpo] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectFocused, setSelectFocused] = useState(false);

    const [bookmarks, setBookmarks] = useState({});
    const [bookmarkingId, setBookmarkingId] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {

        fetchExpos();

        const params = new URLSearchParams(location.search);
        const expoId = params.get('expoId');

        if (expoId) {
            setSelectedExpo(expoId);
            fetchSessions(expoId);
        }

    }, []);

    // ================= FETCH EXPOS =================

    const fetchExpos = async () => {

        try {

            const res = await getExpos();
            setExpos(res.data);

        } catch (error) {

            toast.error('Failed to load expos');

        }
    };

    // ================= FETCH SESSIONS =================

    const fetchSessions = async (expoId) => {

        setLoading(true);

        try {

            const res = await getSessionsByExpo(expoId);

            setSessions(res.data);

            checkAllBookmarks(res.data);

        } catch (error) {

            toast.error('Failed to load sessions');

        } finally {

            setLoading(false);

        }
    };

    // ================= CHECK BOOKMARKS =================

    const checkAllBookmarks = async (sessionList) => {

        try {

            const results = await Promise.allSettled(
                sessionList.map(session =>
                    checkBookmark(session._id)
                )
            );

            const map = {};

            sessionList.forEach((session, index) => {

                if (results[index].status === 'fulfilled') {

                    map[session._id] =
                        results[index].value?.data?.bookmarked || false;
                }
            });

            setBookmarks(map);

        } catch (error) {

            console.log(error);

        }
    };

    // ================= EXPO CHANGE =================

    const handleExpoChange = (e) => {

        const expoId = e.target.value;

        setSelectedExpo(expoId);

        if (expoId) {

            fetchSessions(expoId);

        } else {

            setSessions([]);
        }
    };

    // ================= BOOK SESSION =================

    const handleBook = async (session) => {

        navigate('/attendee/tickets', {
            state: {
                expoId: selectedExpo,
                sessionId: session._id,
                fromSessionBooking: true,
            }
        });
    };

    // ================= BOOKMARK SESSION =================

    const handleBookmark = async (session) => {

        setBookmarkingId(session._id);

        const isBookmarked = bookmarks[session._id];

        try {

            if (isBookmarked) {

                await removeBookmark(session._id);

                setBookmarks(prev => ({
                    ...prev,
                    [session._id]: false
                }));

                toast.success('Bookmark removed');

            } else {

                await addBookmark({
                    session: session._id,
                    expo: selectedExpo
                });

                setBookmarks(prev => ({
                    ...prev,
                    [session._id]: true
                }));

                toast.success('Session bookmarked!');
            }

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                'Failed to update bookmark'
            );

        } finally {

            setBookmarkingId(null);
        }
    };

    const typeStyle = (type) => {

        const map = {

            talk: {
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.3)',
                color: '#6366f1'
            },

            workshop: {
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.3)',
                color: '#059669'
            },

            panel: {
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.3)',
                color: '#7c3aed'
            },

            keynote: {
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.3)',
                color: '#d97706'
            },

            networking: {
                background: 'rgba(236,72,153,0.1)',
                border: '1px solid rgba(236,72,153,0.3)',
                color: '#db2777'
            },
        };

        return map[type] || {
            background: 'rgba(148,163,184,0.1)',
            border: '1px solid #e2e8f0',
            color: '#64748b'
        };
    };

    return (

        <div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                    gap: '16px',
                    flexWrap: 'wrap',
                }}
            >

                <h2
                    style={{
                        fontSize: '22px',
                        fontWeight: '900',
                        color: '#0f172a',
                        margin: 0,
                    }}
                >
                    Browse Sessions
                </h2>

                <select
                    value={selectedExpo}
                    onChange={handleExpoChange}
                    onFocus={() => setSelectFocused(true)}
                    onBlur={() => setSelectFocused(false)}
                    style={{
                        padding: '10px 14px',
                        border: selectFocused
                            ? '1.5px solid #6366f1'
                            : '1.5px solid #e2e8f0',
                        borderRadius: '10px',
                        width: '240px',
                        outline: 'none',
                    }}
                >

                    <option value="">Select an Expo</option>

                    {expos.map(expo => (

                        <option
                            key={expo._id}
                            value={expo._id}
                        >
                            {expo.title}
                        </option>
                    ))}

                </select>

            </div>

            {loading ? (

                <div
                    style={{
                        textAlign: 'center',
                        padding: '60px',
                    }}
                >
                    ⏳ Loading sessions...
                </div>

            ) : sessions.length === 0 ? (

                <div
                    style={{
                        background: 'white',
                        borderRadius: '20px',
                        border: '1px solid #e2e8f0',
                        padding: '64px 32px',
                        textAlign: 'center',
                    }}
                >
                    No sessions available
                </div>

            ) : (

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                    }}
                >

                    {sessions.map(session => {

                        const pct = Math.min(
                            100,
                            Math.round(
                                (session.registeredCount / session.capacity) * 100
                            )
                        );

                        const isMarked =
                            bookmarks[session._id] || false;

                        const isMarking =
                            bookmarkingId === session._id;

                        return (

                            <div
                                key={session._id}
                                style={{
                                    background: 'white',
                                    borderRadius: '20px',
                                    border: '1px solid #e2e8f0',
                                    padding: '22px 24px',
                                }}
                            >

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: '16px',
                                    }}
                                >

                                    <div style={{ flex: 1 }}>

                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: '10px',
                                                alignItems: 'center',
                                                marginBottom: '10px',
                                                flexWrap: 'wrap',
                                            }}
                                        >

                                            <h3
                                                style={{
                                                    fontSize: '16px',
                                                    fontWeight: '800',
                                                    margin: 0,
                                                }}
                                            >
                                                {session.title}
                                            </h3>

                                            <span
                                                style={{
                                                    ...typeStyle(session.type),
                                                    padding: '3px 10px',
                                                    borderRadius: '100px',
                                                    fontSize: '10px',
                                                    fontWeight: '700',
                                                }}
                                            >
                                                {session.type}
                                            </span>

                                        </div>

                                        <p
                                            style={{
                                                fontSize: '13px',
                                                color: '#64748b',
                                            }}
                                        >
                                            {session.description}
                                        </p>

                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '8px',
                                        }}
                                    >

                                        <button
                                            onClick={() =>
                                                handleBook(session)
                                            }
                                            style={{
                                                padding: '8px 16px',
                                                background:
                                                    'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                                border: 'none',
                                                borderRadius: '10px',
                                                color: 'white',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            🎟️ Book Now
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleBookmark(session)
                                            }
                                            disabled={isMarking}
                                            style={{
                                                padding: '8px 16px',
                                                background: isMarked
                                                    ? 'rgba(245,158,11,0.15)'
                                                    : 'rgba(245,158,11,0.08)',
                                                border: isMarked
                                                    ? '1px solid rgba(245,158,11,0.5)'
                                                    : '1px solid rgba(245,158,11,0.3)',
                                                color: '#d97706',
                                                borderRadius: '10px',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                            }}
                                        >

                                            {
                                                isMarking
                                                    ? '⏳'
                                                    : isMarked
                                                    ? '🔖 Saved'
                                                    : '🔖 Bookmark'
                                            }

                                        </button>

                                    </div>

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
};

export default Sessions;