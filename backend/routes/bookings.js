/**
 * BOOKING ROUTER - Quản lý đặt vé
 * Module: bookingRoutes.js
 * Base path: /api/bookings
 */

const express = require('express');
const { readDB, writeDB } = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * LẤY VÉ CỦA USER HIỆN TẠI - GET /api/bookings/my
 * Private - Cần token
 * Quyền: User thường
 */
router.get('/my', verifyToken, (req, res) => {
  const db = readDB();
  const bookings = db.bookings.filter(b => b.userId === req.user.id);
  res.json(bookings);
});

/**
 * LẤY TẤT CẢ VÉ - GET /api/bookings
 * Private - Cần token + Admin
 * Quyền: Admin
 */
router.get('/', verifyToken, isAdmin, (req, res) => {
  const db = readDB();
  res.json(db.bookings);
});

/**
 * TẠO ĐẶT VÉ MỚI - POST /api/bookings
 * Private - Cần token
 * Body: { showtimeId, movieId, movie, date, auditorium, seats, total }
 * Chức năng:
 * 1. Kiểm tra ghế có bị trùng không
 * 2. Tạo booking mới
 * 3. Cập nhật occupiedSeats trong showtime
 */
router.post('/', verifyToken, (req, res) => {
  try {
    const db = readDB();
    const { showtimeId, movieId, movie, date, auditorium, seats, total } = req.body;
    
    // Kiểm tra ghế trùng
    const showtime = db.showtimes.find(st => st.id === showtimeId);
    if (showtime) {
      const conflictingSeats = seats.filter(s => showtime.occupiedSeats.includes(s));
      if (conflictingSeats.length > 0) {
        return res.status(409).json({ 
          error: `Ghế ${conflictingSeats.join(', ')} đã có người đặt!`,
          occupiedSeats: showtime.occupiedSeats
        });
      }
    }
    
    // Tạo booking mới
    const newBooking = {
      id: `BKG${Date.now()}`,                    // ID tự sinh: BKG1734567890123
      userId: req.user.id,                       // Lấy từ token
      showtimeId,
      movieId,
      movie,
      date,
      auditorium,
      seats,                                      // Mảng ghế: ['A1', 'A2']
      total,                                      // Tổng tiền
      status: 'confirmed',
      bookingDate: new Date().toISOString()
    };
    
    // Cập nhật ghế đã đặt trong showtime
    if (showtime) {
      showtime.occupiedSeats.push(...seats);
      const showtimeIndex = db.showtimes.findIndex(st => st.id === showtimeId);
      db.showtimes[showtimeIndex] = showtime;
    }
    
    db.bookings.push(newBooking);
    writeDB(db);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * HỦY ĐẶT VÉ - DELETE /api/bookings/:id
 * Private - Cần token
 * Quyền: User sở hữu vé hoặc Admin
 * Chức năng:
 * 1. Xóa booking
 * 2. Hoàn trả ghế cho showtime
 */
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const db = readDB();
    const bookingIndex = db.bookings.findIndex(b => b.id === req.params.id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ error: 'Không tìm thấy' });
    }
    
    const booking = db.bookings[bookingIndex];
    
    // Kiểm tra quyền: chỉ user sở hữu vé hoặc admin được xóa
    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Không có quyền' });
    }
    
    // Hoàn trả ghế cho showtime
    const showtime = db.showtimes.find(st => st.id === booking.showtimeId);
    if (showtime) {
      // Loại bỏ các ghế đã đặt khỏi occupiedSeats
      showtime.occupiedSeats = showtime.occupiedSeats.filter(s => !booking.seats.includes(s));
      const showtimeIndex = db.showtimes.findIndex(st => st.id === booking.showtimeId);
      db.showtimes[showtimeIndex] = showtime;
    }
    
    // Xóa booking
    db.bookings.splice(bookingIndex, 1);
    writeDB(db);
    res.json({ message: 'Hủy vé thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;