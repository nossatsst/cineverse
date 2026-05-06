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
    // Auth
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
    
    // Movies
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
    
    // Bookings
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
    
    // Users (Admin)
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
    
    // Admin Stats
    getAdminStats: async () => {
        const res = await fetch(`${API_URL}/admin/stats`, { headers: getHeaders() });
        return res.json();
    },
    
    // Showtimes API
    getShowtimesByMovie: async (movieId) => {
        const res = await fetch(`${API_URL}/showtimes/movie/${movieId}`);
        return res.json();
    },
    
    getShowtimeById: async (id) => {
        const res = await fetch(`${API_URL}/showtimes/${id}`);
        return res.json();
    }
};

// Export cho môi trường module (nếu cần)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { api, getToken, setToken, getHeaders };
}