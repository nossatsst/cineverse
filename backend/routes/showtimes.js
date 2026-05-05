const express = require('express');
const { readDB, writeDB } = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Lấy suất chiếu theo phim (công khai)
router.get('/movie/:movieId', (req, res) => {
  const db = readDB();
  const showtimes = (db.showtimes || []).filter(st => st.movieId === req.params.movieId);
  res.json(showtimes);
});

// Lấy chi tiết suất chiếu
router.get('/:id', (req, res) => {
  const db = readDB();
  const showtime = (db.showtimes || []).find(st => st.id === req.params.id);
  if (!showtime) return res.status(404).json({ error: 'Không tìm thấy suất chiếu' });
  res.json(showtime);
});

// Admin: Thêm suất chiếu
router.post('/', verifyToken, isAdmin, (req, res) => {
  const db = readDB();
  const newShowtime = {
    id: `st_${Date.now()}`,
    ...req.body,
    occupiedSeats: []
  };
  if (!db.showtimes) db.showtimes = [];
  db.showtimes.push(newShowtime);
  writeDB(db);
  res.status(201).json(newShowtime);
});

module.exports = router;