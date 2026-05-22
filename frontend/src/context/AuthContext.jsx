import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = () => {
            const token = localStorage.getItem('token');
            if (token) {
                setUser(JSON.parse(localStorage.getItem('user')));
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email, password
            });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            setUser(res.data);
            toast.success('Login successful!');
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', userData);
            toast.success('Registration successful!');
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.info('Logged out successfully');
    };

    // Helper to get dashboard path based on role
    const getDashboardPath = (role) => {
        if (role === 'admin' || role === 'organizer') return '/admin/dashboard';
        if (role === 'exhibitor') return '/exhibitor/dashboard';
        if (role === 'attendee') return '/attendee/dashboard';
        return '/';
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, getDashboardPath }}>
            {children}
        </AuthContext.Provider>
    );
};