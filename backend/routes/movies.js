const express = require('express');
const { getMovies, getMovieById, createMovie, updateMovie, deleteMovie } = require('../controllers/movieController');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Lấy danh sách phim (công khai)
router.get('/', getMovies);

// Lấy chi tiết phim theo ID (công khai)
router.get('/:id', getMovieById);

// Thêm phim mới (chỉ Admin)
router.post('/', verifyToken, isAdmin, createMovie);

// Cập nhật phim (chỉ Admin)
router.put('/:id', verifyToken, isAdmin, updateMovie);

// Xóa phim (chỉ Admin)
router.delete('/:id', verifyToken, isAdmin, deleteMovie);

module.exports = router;