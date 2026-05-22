import { useEffect, useState } from 'react';
import {
    getMyTickets,
    cancelTicket
} from '../../services/api';

import { toast } from 'react-toastify';

const MyTickets = () => {

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelingId, setCancelingId] = useState(null);

    // ================= FETCH TICKETS =================

    const fetchTickets = async () => {

        setLoading(true);

        try {

            const res = await getMyTickets();

            setTickets(res.data);

        } catch (error) {

            console.log(error);

            toast.error('Failed to load tickets');

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchTickets();

    }, []);

    // ================= CANCEL TICKET =================

    const handleCancel = async (ticketId) => {

        const confirmCancel = window.confirm(
            'Are you sure you want to cancel this ticket?'
        );

        if (!confirmCancel) return;

        setCancelingId(ticketId);

        try {

            await cancelTicket(ticketId);

            toast.success('Ticket cancelled successfully');

            fetchTickets();

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                'Failed to cancel ticket'
            );

        } finally {

            setCancelingId(null);
        }
    };

    // ================= STATUS STYLE =================

    const statusStyle = (status) => {

        const map = {

            active: {
                background: 'rgba(16,185,129,0.12)',
                color: '#059669',
                border: '1px solid rgba(16,185,129,0.25)',
            },

            cancelled: {
                background: 'rgba(239,68,68,0.12)',
                color: '#dc2626',
                border: '1px solid rgba(239,68,68,0.25)',
            },

            used: {
                background: 'rgba(99,102,241,0.12)',
                color: '#4f46e5',
                border: '1px solid rgba(99,102,241,0.25)',
            },
        };

        return (
            map[status] || {
                background: '#f1f5f9',
                color: '#64748b',
                border: '1px solid #e2e8f0',
            }
        );
    };

    // ================= TICKET TYPE STYLE =================

    const typeStyle = (type) => {

        const map = {

            vip: {
                background: 'rgba(245,158,11,0.12)',
                color: '#d97706',
                border: '1px solid rgba(245,158,11,0.25)',
            },

            standard: {
                background: 'rgba(99,102,241,0.12)',
                color: '#4f46e5',
                border: '1px solid rgba(99,102,241,0.25)',
            },

            student: {
                background: 'rgba(16,185,129,0.12)',
                color: '#059669',
                border: '1px solid rgba(16,185,129,0.25)',
            },
        };

        return (
            map[type] || {
                background: '#f8fafc',
                color: '#475569',
                border: '1px solid #e2e8f0',
            }
        );
    };

    return (

        <div>

            {/* HEADER */}

            <div
                style={{
                    marginBottom: '24px',
                }}
            >

                <h2
                    style={{
                        fontSize: '24px',
                        fontWeight: '900',
                        color: '#0f172a',
                        marginBottom: '6px',
                    }}
                >
                    My Tickets
                </h2>

                <p
                    style={{
                        color: '#64748b',
                        margin: 0,
                    }}
                >
                    View and manage your booked expo tickets
                </p>

            </div>

            {/* LOADING */}

            {loading ? (

                <div
                    style={{
                        textAlign: 'center',
                        padding: '70px',
                        background: 'white',
                        borderRadius: '24px',
                        border: '1px solid #e2e8f0',
                    }}
                >
                    ⏳ Loading tickets...
                </div>

            ) : tickets.length === 0 ? (

                <div
                    style={{
                        background: 'white',
                        borderRadius: '24px',
                        border: '1px solid #e2e8f0',
                        padding: '70px 30px',
                        textAlign: 'center',
                    }}
                >

                    <div
                        style={{
                            fontSize: '52px',
                            marginBottom: '16px',
                        }}
                    >
                        🎟️
                    </div>

                    <h3
                        style={{
                            marginBottom: '8px',
                            color: '#0f172a',
                        }}
                    >
                        No Tickets Found
                    </h3>

                    <p
                        style={{
                            color: '#64748b',
                            margin: 0,
                        }}
                    >
                        You haven't booked any expo tickets yet.
                    </p>

                </div>

            ) : (

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '18px',
                    }}
                >

                    {tickets.map(ticket => {

                        const expo = ticket.expoId || {};
                        const isCanceling =
                            cancelingId === ticket._id;

                        return (

                            <div
                                key={ticket._id}
                                style={{
                                    background: 'white',
                                    borderRadius: '24px',
                                    border: '1px solid #e2e8f0',
                                    overflow: 'hidden',
                                }}
                            >

                                {/* TOP */}

                                <div
                                    style={{
                                        padding: '24px',
                                        borderBottom:
                                            '1px solid #f1f5f9',
                                    }}
                                >

                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent:
                                                'space-between',
                                            gap: '20px',
                                            flexWrap: 'wrap',
                                        }}
                                    >

                                        {/* LEFT */}

                                        <div style={{ flex: 1 }}>

                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    flexWrap: 'wrap',
                                                    marginBottom: '10px',
                                                }}
                                            >

                                                <h3
                                                    style={{
                                                        margin: 0,
                                                        fontSize: '20px',
                                                        fontWeight: '800',
                                                        color: '#0f172a',
                                                    }}
                                                >
                                                    {expo.title || 'Expo'}
                                                </h3>

                                                <span
                                                    style={{
                                                        ...statusStyle(
                                                            ticket.status
                                                        ),
                                                        padding:
                                                            '5px 12px',
                                                        borderRadius:
                                                            '999px',
                                                        fontSize: '12px',
                                                        fontWeight: '700',
                                                        textTransform:
                                                            'capitalize',
                                                    }}
                                                >
                                                    {ticket.status}
                                                </span>

                                                <span
                                                    style={{
                                                        ...typeStyle(
                                                            ticket.ticketType
                                                        ),
                                                        padding:
                                                            '5px 12px',
                                                        borderRadius:
                                                            '999px',
                                                        fontSize: '12px',
                                                        fontWeight: '700',
                                                        textTransform:
                                                            'capitalize',
                                                    }}
                                                >
                                                    {ticket.ticketType}
                                                </span>

                                            </div>

                                            <p
                                                style={{
                                                    margin: 0,
                                                    color: '#64748b',
                                                    lineHeight: '1.7',
                                                }}
                                            >
                                                {expo.description ||
                                                    'No description available'}
                                            </p>

                                        </div>

                                        {/* RIGHT */}

                                        <div
                                            style={{
                                                minWidth: '220px',
                                            }}
                                        >

                                            <div
                                                style={{
                                                    background:
                                                        '#f8fafc',
                                                    border:
                                                        '1px dashed #cbd5e1',
                                                    borderRadius:
                                                        '18px',
                                                    padding: '18px',
                                                }}
                                            >

                                                <p
                                                    style={{
                                                        margin: '0 0 8px',
                                                        fontSize: '12px',
                                                        color: '#64748b',
                                                        fontWeight: '700',
                                                    }}
                                                >
                                                    TICKET CODE
                                                </p>

                                                <h2
                                                    style={{
                                                        margin: 0,
                                                        fontSize: '22px',
                                                        letterSpacing:
                                                            '2px',
                                                        color: '#0f172a',
                                                    }}
                                                >
                                                    {ticket.ticketCode}
                                                </h2>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                {/* DETAILS */}

                                <div
                                    style={{
                                        padding: '22px 24px',
                                    }}
                                >

                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns:
                                                'repeat(auto-fit,minmax(220px,1fr))',
                                            gap: '14px',
                                        }}
                                    >

                                        <div>
                                            <p
                                                style={{
                                                    margin:
                                                        '0 0 4px',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    color: '#94a3b8',
                                                }}
                                            >
                                                📍 LOCATION
                                            </p>

                                            <p
                                                style={{
                                                    margin: 0,
                                                    color: '#0f172a',
                                                    fontWeight: '600',
                                                }}
                                            >
                                                {expo.location ||
                                                    'N/A'}
                                            </p>
                                        </div>

                                        <div>
                                            <p
                                                style={{
                                                    margin:
                                                        '0 0 4px',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    color: '#94a3b8',
                                                }}
                                            >
                                                📅 DATE
                                            </p>

                                            <p
                                                style={{
                                                    margin: 0,
                                                    color: '#0f172a',
                                                    fontWeight: '600',
                                                }}
                                            >
                                                {
                                                    expo.startDate
                                                        ? new Date(
                                                              expo.startDate
                                                          ).toLocaleDateString()
                                                        : 'N/A'
                                                }
                                            </p>
                                        </div>

                                        <div>
                                            <p
                                                style={{
                                                    margin:
                                                        '0 0 4px',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    color: '#94a3b8',
                                                }}
                                            >
                                                🕒 BOOKED ON
                                            </p>

                                            <p
                                                style={{
                                                    margin: 0,
                                                    color: '#0f172a',
                                                    fontWeight: '600',
                                                }}
                                            >
                                                {
                                                    new Date(
                                                        ticket.createdAt
                                                    ).toLocaleDateString()
                                                }
                                            </p>
                                        </div>

                                    </div>

                                    {/* ACTIONS */}

                                    <div
                                        style={{
                                            marginTop: '24px',
                                            display: 'flex',
                                            justifyContent:
                                                'flex-end',
                                        }}
                                    >

                                        {
                                            ticket.status ===
                                                'active' && (

                                                <button
                                                    onClick={() =>
                                                        handleCancel(
                                                            ticket._id
                                                        )
                                                    }
                                                    disabled={isCanceling}
                                                    style={{
                                                        padding:
                                                            '10px 18px',
                                                        background:
                                                            'rgba(239,68,68,0.12)',
                                                        color: '#dc2626',
                                                        border:
                                                            '1px solid rgba(239,68,68,0.25)',
                                                        borderRadius:
                                                            '12px',
                                                        fontWeight:
                                                            '700',
                                                        cursor:
                                                            'pointer',
                                                    }}
                                                >
                                                    {
                                                        isCanceling
                                                            ? '⏳ Canceling...'
                                                            : '❌ Cancel Ticket'
                                                    }
                                                </button>
                                            )
                                        }

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

export default MyTickets;