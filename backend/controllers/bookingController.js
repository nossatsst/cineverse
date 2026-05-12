/**
 * BOOKING CONTROLLER - Quản lý đặt vé
 * Module: bookingController.js
 */

const { readDB, writeDB } = require('../config/database');

/**
 * Lấy danh sách vé của user hiện tại - GET /api/bookings/my-bookings
 * Cần middleware auth (req.user từ token)
 */
const getMyBookings = async (req, res) => {
    try {
        const db = readDB();
        const bookings = db.bookings.filter(b => b.userId === req.user.id);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Lấy tất cả vé (chỉ admin) - GET /api/bookings
 * Cần middleware isAdmin
 */
const getAllBookings = async (req, res) => {
    try {
        const db = readDB();
        res.json(db.bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Tạo đặt vé mới - POST /api/bookings
 * Body: { movieId, showtimeId, seats, totalPrice, ... }
 */
const createBooking = async (req, res) => {
    try {
        const db = readDB();
        const newBooking = {
            id: `BKG${Date.now()}`,           // ID tự sinh: BKG1734567890123
            userId: req.user.id,               // Lấy từ token
            ...req.body,                       // Các field còn lại từ client
            bookingDate: new Date().toISOString(),
            status: 'confirmed'
        };
        db.bookings.push(newBooking);
        writeDB(db);
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Hủy đặt vé - DELETE /api/bookings/:id
 * Params: id (ID của vé cần hủy)
 */
const cancelBooking = async (req, res) => {
    try {
        const db = readDB();
        const index = db.bookings.findIndex(b => b.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Không tìm thấy đặt vé' });
        }
        
        db.bookings.splice(index, 1);  // Xóa vé khỏi mảng
        writeDB(db);
        res.json({ message: 'Hủy vé thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getMyBookings, getAllBookings, createBooking, cancelBooking };