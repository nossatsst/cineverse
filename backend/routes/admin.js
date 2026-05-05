const express = require('express');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { readDB } = require('../config/database');

const router = express.Router();

router.get('/stats', verifyToken, isAdmin, (req, res) => {
    const db = readDB();
    
    const stats = {
        totalUsers: db.users.filter(u => u.role === 'user').length,
        totalMovies: db.movies.length,
        totalBookings: db.bookings.length,
        totalRevenue: db.bookings.reduce((sum, b) => sum + b.total, 0),
        activeMovies: db.movies.filter(m => m.status === 'now_showing').length,
        upcomingMovies: db.movies.filter(m => m.status === 'coming_soon').length
    };
    
    res.json(stats);
});

module.exports = router;