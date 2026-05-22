import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" />;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their correct dashboard
        if (user.role === 'admin' || user.role === 'organizer') return <Navigate to="/admin/dashboard" />;
        if (user.role === 'exhibitor') return <Navigate to="/exhibitor/dashboard" />;
        if (user.role === 'attendee') return <Navigate to="/attendee/dashboard" />;
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;