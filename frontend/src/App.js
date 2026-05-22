import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminDashboard from './pages/admin/Dashboard';
import ExhibitorDashboard from './pages/exhibitor/Dashboard';
import AttendeeDashboard from './pages/attendee/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {

    return (
        <AuthProvider>
            <Router>

                <div className="min-h-screen bg-gray-50">

                    <Navbar />

                    <Routes>

                        <Route path="/" element={<Home />} />

                        <Route path="/login" element={<Login />} />

                        <Route path="/register" element={<Register />} />
                        

                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />

                        <Route
                            path="/reset-password/:token"
                            element={<ResetPassword />}
                        />

                        {/* ADMIN */}
                        <Route
                            path="/admin/*"
                            element={
                                <ProtectedRoute allowedRoles={['admin', 'organizer']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* EXHIBITOR */}
                        <Route
                            path="/exhibitor/*"
                            element={
                                <ProtectedRoute allowedRoles={['exhibitor']}>
                                    <ExhibitorDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* ATTENDEE */}
                        <Route
                            path="/attendee/*"
                            element={
                                <ProtectedRoute allowedRoles={['attendee']}>
                                    <AttendeeDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="*" element={<Navigate to="/" />} />

                    </Routes>

                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                    />

                </div>

            </Router>
        </AuthProvider>
    );
}

export default App;