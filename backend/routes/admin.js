/**
 * STATS ROUTER - Thống kê dữ liệu hệ thống
 * Module: statsRoutes.js
 * Endpoint: /api/stats
 * Quyền truy cập: Chỉ Admin
 */

const express = require('express');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { readDB } = require('../config/database');

const router = express.Router();

/**
 * GET /api/stats
 * Lấy các chỉ số thống kê tổng quan của hệ thống
 * Yêu cầu: Token JWT + Quyền Admin
 * Các chỉ số trả về:
 * - totalUsers: Tổng số user thường (không tính admin)
 * - totalMovies: Tổng số phim
 * - totalBookings: Tổng số vé đã đặt
 * - totalRevenue: Tổng doanh thu (từ tất cả bookings)
 * - activeMovies: Số phim đang chiếu
 * - upcomingMovies: Số phim sắp chiếu
 */
router.get('/stats', verifyToken, isAdmin, (req, res) => {
    const db = readDB();
    // Tính toán các chỉ số thống kê
    const stats = {
        // Tổng người dùng (chỉ user thường, không tính admin)
        totalUsers: db.users.filter(u => u.role === 'user').length,
        // Tổng số phim
        totalMovies: db.movies.length,
        // Tổng số vé đã đặt
        totalBookings: db.bookings.length,
        // Tổng doanh thu (cộng dồn total từ mỗi booking)
        totalRevenue: db.bookings.reduce((sum, b) => sum + b.total, 0),
        // Số phim đang chiếu (status = 'now_showing')
        activeMovies: db.movies.filter(m => m.status === 'now_showing').length,
        // Số phim sắp chiếu (status = 'coming_soon')
        upcomingMovies: db.movies.filter(m => m.status === 'coming_soon').length
    };

    res.json(stats);
});

module.exports = router;