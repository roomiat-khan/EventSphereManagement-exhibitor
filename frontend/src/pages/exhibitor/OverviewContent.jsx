import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    FiFileText,
    FiCheckCircle,
    FiClock,
    FiXCircle,
    FiGrid,
    FiMapPin,
    FiCalendar,
    FiDollarSign,
    FiArrowRight
} from 'react-icons/fi';

import {
    getExhibitorDashboardStats
} from '../../services/api';

import { AuthContext } from '../../context/AuthContext';

import { toast } from 'react-toastify';

const ExhibitorOverview = ({ setActiveTab }) => {

    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    const [stats, setStats] = useState({});

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchDashboard();

    }, []);

    const fetchDashboard = async () => {

        try {

            const res = await getExhibitorDashboardStats();

            setStats(res.data);

        } catch (error) {

            console.log(error);

            toast.error('Failed to load dashboard');

        } finally {

            setLoading(false);
        }
    };

    const applications = stats?.myApplications || [];

    const statusStyle = (status) => {

        switch (status) {

            case 'approved':
                return {
                    background: 'rgba(16,185,129,0.12)',
                    color: '#059669'
                };

            case 'pending':
                return {
                    background: 'rgba(245,158,11,0.12)',
                    color: '#d97706'
                };

            case 'rejected':
                return {
                    background: 'rgba(239,68,68,0.12)',
                    color: '#dc2626'
                };

            default:
                return {
                    background: '#f1f5f9',
                    color: '#64748b'
                };
        }
    };

    if (loading) {

        return (

            <div className="overview-loader">

                <div className="overview-spinner"></div>

            </div>
        );
    }

    return (

        <div className="overview-container">

            <style>{`

                *{
                    box-sizing:border-box;
                }

                .overview-container{
                    width:100%;
                    font-family:'Segoe UI',sans-serif;
                }

                .overview-loader{
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    height:400px;
                }

                .overview-spinner{
                    width:45px;
                    height:45px;
                    border:4px solid #10b981;
                    border-top-color:transparent;
                    border-radius:50%;
                    animation:spin 0.8s linear infinite;
                }

                @keyframes spin{
                    to{
                        transform:rotate(360deg);
                    }
                }

                .overview-banner{
                    background:linear-gradient(135deg,#0f172a,#111827);
                    border-radius:24px;
                    padding:35px;
                    margin-bottom:24px;
                    color:white;
                }

                .overview-banner-top{
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:20px;
                    flex-wrap:wrap;
                }

                .overview-title{
                    font-size:32px;
                    font-weight:800;
                    margin-bottom:10px;
                }

                .overview-subtitle{
                    color:#cbd5e1;
                    font-size:15px;
                    line-height:1.7;
                    max-width:700px;
                }

                .overview-btn{
                    background:#10b981;
                    border:none;
                    color:white;
                    padding:14px 24px;
                    border-radius:14px;
                    font-size:14px;
                    font-weight:700;
                    cursor:pointer;
                    transition:0.2s;
                    display:flex;
                    align-items:center;
                    gap:8px;
                }

                .overview-btn:hover{
                    transform:translateY(-3px);
                }

                .stats-grid{
                    display:grid;
                    grid-template-columns:repeat(5,1fr);
                    gap:20px;
                    margin-bottom:24px;
                }

                .stat-card{
                    background:white;
                    border:1px solid #e2e8f0;
                    border-radius:22px;
                    padding:24px;
                    transition:0.2s;
                }

                .stat-card:hover{
                    transform:translateY(-4px);
                    box-shadow:0 15px 30px rgba(0,0,0,0.08);
                }

                .stat-icon{
                    width:52px;
                    height:52px;
                    border-radius:16px;
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    color:white;
                    font-size:22px;
                    margin-bottom:18px;
                }

                .stat-value{
                    font-size:30px;
                    font-weight:800;
                    color:#0f172a;
                }

                .stat-label{
                    margin-top:6px;
                    color:#64748b;
                    font-size:13px;
                    font-weight:600;
                }

                .history-section{
                    background:white;
                    border-radius:24px;
                    border:1px solid #e2e8f0;
                    overflow:hidden;
                }

                .history-head{
                    padding:24px;
                    border-bottom:1px solid #f1f5f9;
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    flex-wrap:wrap;
                    gap:10px;
                }

                .history-title{
                    font-size:22px;
                    font-weight:800;
                    color:#0f172a;
                }

                .history-investment{
                    color:#059669;
                    font-weight:700;
                    font-size:15px;
                }

                .table-wrapper{
                    overflow-x:auto;
                }

                table{
                    width:100%;
                    border-collapse:collapse;
                    min-width:1200px;
                }

                th{
                    background:#f8fafc;
                    padding:18px;
                    text-align:left;
                    font-size:12px;
                    color:#64748b;
                    text-transform:uppercase;
                    letter-spacing:0.5px;
                }

                td{
                    padding:18px;
                    border-top:1px solid #f1f5f9;
                    vertical-align:top;
                }

                tr:hover{
                    background:#f8fafc;
                }

                .expo-name{
                    font-size:15px;
                    font-weight:700;
                    color:#0f172a;
                    margin-bottom:6px;
                }

                .expo-meta{
                    display:flex;
                    align-items:center;
                    gap:6px;
                    color:#64748b;
                    font-size:13px;
                    margin-top:5px;
                }

                .status-badge{
                    display:inline-flex;
                    justify-content:center;
                    align-items:center;
                    padding:7px 14px;
                    border-radius:100px;
                    font-size:12px;
                    font-weight:700;
                    text-transform:capitalize;
                }

                .booth-card{
                    background:#f8fafc;
                    border:1px solid #e2e8f0;
                    border-radius:14px;
                    padding:12px;
                    min-width:160px;
                }

                .booth-title{
                    font-size:14px;
                    font-weight:700;
                    color:#0f172a;
                    margin-bottom:4px;
                }

                .booth-text{
                    color:#64748b;
                    font-size:13px;
                    margin-top:4px;
                }

                .empty-box{
                    padding:70px 20px;
                    text-align:center;
                    color:#94a3b8;
                    font-size:15px;
                }

                @media(max-width:1200px){

                    .stats-grid{
                        grid-template-columns:repeat(2,1fr);
                    }
                }

                @media(max-width:768px){

                    .stats-grid{
                        grid-template-columns:1fr;
                    }

                    .overview-banner{
                        padding:24px;
                    }

                    .overview-title{
                        font-size:26px;
                    }
                }

            `}</style>

            <div className="overview-banner">

                <div className="overview-banner-top">

                    <div>

                        <div className="overview-title">
                            Welcome Back, {user?.name}
                        </div>

                        <div className="overview-subtitle">
                            Manage your expo applications, booth assignments,
                            participation history and investment details
                            from one professional dashboard.
                        </div>

                    </div>

                    <button
                        className="overview-btn"
                        onClick={() => {

                            setActiveTab('apply');

                            navigate('/exhibitor/apply');
                        }}
                    >
                        <FiArrowRight />
                        Apply For Expo
                    </button>

                </div>

            </div>

        </div>
    );
};

export default ExhibitorOverview;