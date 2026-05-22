import { useContext } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin/expos', label: 'Manage Expos', icon: '🎪' },
        { path: '/admin/booths', label: 'Booth Management', icon: '🪑' },
        { path: '/admin/exhibitors', label: 'Exhibitors', icon: '🏢' },
        { path: '/admin/sessions', label: 'Schedule', icon: '📅' },
        { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
    ];

    return (
        <div className="flex h-screen bg-gray-950 overflow-hidden">
            {/* Sidebar */}
            <div className="w-72 bg-gray-900 text-white flex flex-col shadow-2xl">
                {/* Logo Header */}
                <div className="p-8 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-inner">
                            ES
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tighter">EventSphere</h1>
                            <p className="text-xs text-gray-400 -mt-1">ADMIN PORTAL</p>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="px-8 py-6 border-b border-gray-800">
                    <p className="text-gray-400 text-sm">Welcome back,</p>
                    <p className="font-semibold text-lg text-white">{user?.name}</p>
                    <p className="text-indigo-400 text-sm capitalize">{user?.role}</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 overflow-y-auto">
                    <p className="px-6 text-xs uppercase tracking-widest text-gray-500 mb-4 font-medium">Management</p>
                    
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-6 py-4 mb-1 text-[15px] font-medium rounded-2xl transition-all duration-200
                                ${location.pathname === item.path 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <span className="text-xl opacity-75">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="p-6 border-t border-gray-800 mt-auto">
                    <button
                        onClick={logout}
                        className="w-full bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <span>🚪</span>
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto bg-gray-100">
                <div className="p-8">
                    <Outlet />   {/* This will render child pages */}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;