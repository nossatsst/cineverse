const express = require('express');
const { readDB, writeDB } = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Lấy bookings của user
router.get('/my', verifyToken, (req, res) => {
  const db = readDB();
  const bookings = db.bookings.filter(b => b.userId === req.user.id);
  res.json(bookings);
});

// Lấy tất cả bookings (Admin)
router.get('/', verifyToken, isAdmin, (req, res) => {
  const db = readDB();
  res.json(db.bookings);
});

// Tạo booking mới
router.post('/', verifyToken, (req, res) => {
  try {
    const db = readDB();
    const { showtimeId, movieId, movie, date, auditorium, seats, total } = req.body;
    
    // Kiểm tra ghế có bị trùng không
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
    
    // Tạo booking
    const newBooking = {
      id: `BKG${Date.now()}`,
      userId: req.user.id,
      showtimeId,
      movieId,
      movie,
      date,
      auditorium,
      seats,
      total,
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

// Hủy booking
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const db = readDB();
    const bookingIndex = db.bookings.findIndex(b => b.id === req.params.id);
    if (bookingIndex === -1) return res.status(404).json({ error: 'Không tìm thấy' });
    
    const booking = db.bookings[bookingIndex];
    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Không có quyền' });
    }
    
    // Xóa ghế khỏi occupiedSeats của showtime
    const showtime = db.showtimes.find(st => st.id === booking.showtimeId);
    if (showtime) {
      showtime.occupiedSeats = showtime.occupiedSeats.filter(s => !booking.seats.includes(s));
      const showtimeIndex = db.showtimes.findIndex(st => st.id === booking.showtimeId);
      db.showtimes[showtimeIndex] = showtime;
    }
    
    db.bookings.splice(bookingIndex, 1);
    writeDB(db);
    res.json({ message: 'Hủy vé thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;