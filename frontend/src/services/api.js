import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});
// Automatically attach token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token expiry globally
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getUserProfile = () => API.get('/auth/profile');

// Expos
export const getExpos = () => API.get('/expos');
export const getAllExposAdmin = () => API.get('/expos/admin');
export const getExpoById = (id) => API.get(`/expos/${id}`);
export const createExpo = (data) => API.post('/expos', data);
export const updateExpo = (id, data) => API.put(`/expos/${id}`, data);
export const deleteExpo = (id) => API.delete(`/expos/${id}`);

// Booths
export const getBoothsByExpo = (expoId) => API.get(`/booths/expo/${expoId}`);
export const createBooth = (data) => API.post('/booths', data);
export const updateBooth = (id, data) => API.put(`/booths/${id}`, data);
export const deleteBooth = (id) => API.delete(`/booths/${id}`);
export const reserveBooth = (id) => API.put(`/booths/${id}/reserve`);

// Exhibitors
export const applyForExpo = (data) => API.post('/exhibitors/apply', data);
export const getMyApplications = () => API.get('/exhibitors/my-applications');
export const getAllApplications = () => API.get('/exhibitors/applications');
export const approveExhibitor = (id) => API.put(`/exhibitors/applications/${id}/status`, { status: 'approved' });
export const rejectExhibitor = (id, reason) => API.put(`/exhibitors/applications/${id}/status`, { status: 'rejected', rejectionReason: reason });

// Sessions
export const getSessionsByExpo = (expoId) => API.get(`/sessions/expo/${expoId}`);
export const getAllSessions = () => API.get('/sessions');
export const createSession = (data) => API.post('/sessions', data);
export const updateSession = (id, data) => API.put(`/sessions/${id}`, data);
export const deleteSession = (id) => API.delete(`/sessions/${id}`);

// Bookings
export const bookSession = (data) => API.post('/bookings', data);
export const getMyBookings = () => API.get('/bookings/my');
export const cancelBooking = (id) => API.delete(`/bookings/${id}`);
export const getAllBookings = () => API.get('/bookings');
export const getBookingStats = () => API.get('/bookings/stats');

export const getAdminStats = () => API.get('/stats/admin');
export const getExhibitorStats = () => API.get('/stats/exhibitor');
export const getAttendeeStats = () => API.get('/stats/attendee');

// Feedback
export const submitFeedback = (data) => API.post('/feedback', data);
export const getMyFeedback = () => API.get('/feedback/my');
export const getAllFeedback = () => API.get('/feedback');
export const updateFeedbackStatus = (id, status) => API.put(`/feedback/${id}`, { status });

// Bookmarks
export const addBookmark = (data) =>  API.post('/bookmarks', data);
export const removeBookmark = (sessionId) => API.delete(`/bookmarks/${sessionId}`);
export const getMyBookmarks = () => API.get('/bookmarks/my');
export const checkBookmark = (sessionId) => API.get(`/bookmarks/check/${sessionId}`);

// Notifications
export const getMyNotifications = () => API.get('/notifications');
export const markNotificationRead = (id) => API.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => API.put('/notifications/read-all');
export const deleteNotification = (id) => API.delete(`/notifications/${id}`);

// Reports
export const downloadReport = () => API.get('/reports/download', { responseType: 'blob' });

// Tickets
export const bookTicket         = (data) => API.post('/tickets', data);
export const getMyTickets       = ()     => API.get('/tickets/my');
export const cancelTicket       = (id)   => API.put(`/tickets/${id}/cancel`);
export const getAllTickets      = (params) => API.get('/tickets', { params });
export const getTicketStats     = ()     => API.get('/tickets/stats');
export const markTicketUsed     = (id)   => API.put(`/tickets/${id}/use`);
// Add these with other ticket functions (around line ~100)
export const generateTicketForAllAttendees = (data) => API.post('/admin/generate-tickets-all', data);

// ========== NEW FUNCTIONS FOR ADMIN TICKET GENERATION ==========

// Get all users (for admin to select attendee)
// Returns all users with role 'attendee' or all users (backend handles filtering)
export const getAllUsers = () => API.get('/admin/users');

// Generate ticket for attendee (admin only)
// Expects: { attendeeId, expoId, ticketType }
export const generateTicket = (data) => API.post('/admin/generate-ticket', data);

// Get single user by ID (optional - for details)
export const getUserById = (id) => API.get(`/admin/users/${id}`);

// Get all tickets with filters (already exists - getAllTickets)
// Get ticket by ID
export const getTicketById = (id) => API.get(`/tickets/${id}`);

// Bulk generate tickets for multiple attendees
export const bulkGenerateTickets = (data) => API.post('/admin/bulk-generate-tickets', data);

// Get ticket QR code (if you want QR feature)
export const getTicketQR = (ticketId) => API.get(`/tickets/${ticketId}/qr`, { responseType: 'blob' });

// Send ticket email to attendee
export const sendTicketEmail = (ticketId) => API.post(`/tickets/${ticketId}/send-email`);


export const getExhibitorDashboardStats = () =>
    API.get('/exhibitors/dashboard-stats');

// ========== END NEW FUNCTIONS ==========

export default API;