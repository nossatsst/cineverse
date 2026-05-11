const API_URL = 'http://localhost:3000/api';

function getToken() {
    return localStorage.getItem('cineverse_token');
}

function setToken(token) {
    localStorage.setItem('cineverse_token', token);
}

function getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

const api = {
    // ==================== AUTH ====================
    login: async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setToken(data.token);
        localStorage.setItem('cineverse_user', JSON.stringify(data.user));
        return data;
    },
    
    register: async (userData) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },
    
    getCurrentUser: async () => {
        const res = await fetch(`${API_URL}/auth/me`, { headers: getHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },
    
    // ==================== ĐỔI MẬT KHẨU (THÊM MỚI) ====================
    changePassword: async (oldPassword, newPassword) => {
        const res = await fetch(`${API_URL}/auth/change-password`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ oldPassword, newPassword })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },
    
    // ==================== QUÊN MẬT KHẨU (THÊM MỚI) ====================
    forgotPassword: async (email) => {
        const res = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },
    
    resetPassword: async (token, newPassword) => {
        const res = await fetch(`${API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },
    
    // ==================== MOVIES ====================
    getMovies: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${API_URL}/movies${query ? `?${query}` : ''}`);
        return res.json();
    },
    
    getMovieById: async (id) => {
        const res = await fetch(`${API_URL}/movies/${id}`);
        return res.json();
    },
    
    addMovie: async (movieData) => {
        const res = await fetch(`${API_URL}/movies`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(movieData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },
    
    updateMovie: async (id, movieData) => {
        const res = await fetch(`${API_URL}/movies/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(movieData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },
    
    deleteMovie: async (id) => {
        const res = await fetch(`${API_URL}/movies/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },
    
    // ==================== BOOKINGS ====================
    getMyBookings: async () => {
        const res = await fetch(`${API_URL}/bookings/my`, { headers: getHeaders() });
        return res.json();
    },
    
    getAllBookings: async () => {
        const res = await fetch(`${API_URL}/bookings`, { headers: getHeaders() });
        return res.json();
    },
    
    createBooking: async (bookingData) => {
        const res = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(bookingData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },
    
    cancelBooking: async (id) => {
        const res = await fetch(`${API_URL}/bookings/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },
    
    // ==================== USERS (ADMIN) ====================
    getAllUsers: async () => {
        const res = await fetch(`${API_URL}/users`, { headers: getHeaders() });
        return res.json();
    },
    
    updateUser: async (id, userData) => {
        const res = await fetch(`${API_URL}/users/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(userData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },
    
    deleteUser: async (id) => {
        const res = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },
    
    // ==================== ADMIN STATS ====================
    getAdminStats: async () => {
        const res = await fetch(`${API_URL}/admin/stats`, { headers: getHeaders() });
        return res.json();
    },
    
    // ==================== SHOWTIMES ====================
    getShowtimesByMovie: async (movieId) => {
        const res = await fetch(`${API_URL}/showtimes/movie/${movieId}`);
        return res.json();
    },
    
    getShowtimeById: async (id) => {
        const res = await fetch(`${API_URL}/showtimes/${id}`);
        return res.json();
    },
    
    // ==================== REVIEWS (THÊM MỚI) ====================
    getReviewsByMovie: async (movieId) => {
        const res = await fetch(`${API_URL}/reviews/movie/${movieId}`);
        return res.json();
    },
    
    addReview: async (reviewData) => {
        const res = await fetch(`${API_URL}/reviews`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(reviewData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
    },
    
    // ==================== COUPONS (THÊM MỚI) ====================
    validateCoupon: async (code) => {
        const res = await fetch(`${API_URL}/coupons/validate/${code}`);
        return res.json();
    },
    
    // ==================== QR CODE (THÊM MỚI) ====================
    generateQRCode: async (bookingId) => {
        const res = await fetch(`${API_URL}/qrcode/${bookingId}`, { headers: getHeaders() });
        return res.json();
    }
};

// Export cho môi trường module (nếu cần)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { api, getToken, setToken, getHeaders };
}