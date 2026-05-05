const express = require('express');
const { getMovies, getMovieById, createMovie, updateMovie, deleteMovie } = require('../controllers/movieController');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Lấy danh sách phim
router.get('/', getMovies);

// Lấy chi tiết phim theo ID
router.get('/:id', getMovieById);

// Thêm phim mới (Admin)
router.post('/', verifyToken, isAdmin, createMovie);

// Cập nhật phim (Admin)
router.put('/:id', verifyToken, isAdmin, updateMovie);

// Xóa phim (Admin)
router.delete('/:id', verifyToken, isAdmin, deleteMovie);

module.exports = router;