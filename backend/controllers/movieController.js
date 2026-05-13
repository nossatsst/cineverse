/**
 * MOVIE CONTROLLER - Quản lý phim
 * Module: movieController.js
 */

const { readDB, writeDB } = require('../config/database');

// Lấy danh sách phim
const getMovies = (req, res) => {

/**
 * Lấy danh sách tất cả phim - GET /api/movies
 * Public: Không cần auth
 */
const getMovies = async (req, res) => {
    try {
        const db = readDB();
        res.json(db.movies || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
<<<<<<< HEAD


/**
 * Lấy chi tiết phim theo ID - GET /api/movies/:id
 * Public
 */

=======
<<<<<<< Updated upstream
>>>>>>> truong-nhom
const getMovieById = async (req, res) => {
    try {
        const db = readDB();
        const movie = db.movies.find(m => m.id === req.params.id);
<<<<<<< HEAD
        
        if (!movie) {
            return res.status(404).json({ error: 'Không tìm thấy phim' });
        }
        
=======
        if (!movie) return res.status(404).json({ error: 'Không tìm thấy phim' });
=======

// Lấy chi tiết phim theo ID
const getMovieById = (req, res) => {
    try {
        const db = readDB();
        const movie = (db.movies || []).find(m => m.id === req.params.id);
        if (!movie) {
            return res.status(404).json({ error: 'Không tìm thấy phim' });
        }
>>>>>>> Stashed changes
>>>>>>> truong-nhom
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

<<<<<<< HEAD
/**
 * Thêm phim mới - POST /api/movies
 * Body: { title, genre, duration, releaseDate, description, poster, trailer, ... }
 * Quyền: Admin
 */
const createMovie = async (req, res) => {
    try {
        const db = readDB();
        const newMovie = {
            id: `movie_${Date.now()}`,  // Tự sinh ID: movie_1734567890123
            ...req.body
        };
        
=======
<<<<<<< Updated upstream
const createMovie = async (req, res) => {
    try {
        const db = readDB();
        const newMovie = { id: `movie_${Date.now()}`, ...req.body };
=======
// Thêm phim mới (Admin)
const createMovie = (req, res) => {
    try {
        const db = readDB();
        const newMovie = {
            id: `movie_${Date.now()}`,
            ...req.body,
            createdAt: new Date().toISOString()
        };
        if (!db.movies) db.movies = [];
>>>>>>> Stashed changes
>>>>>>> truong-nhom
        db.movies.push(newMovie);
        writeDB(db);
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

<<<<<<< HEAD
/**
 * Cập nhật thông tin phim - PUT /api/movies/:id
 * Body: Các field cần cập nhật
 * Quyền: Admin
 */
=======
<<<<<<< Updated upstream
>>>>>>> truong-nhom
const updateMovie = async (req, res) => {
    try {
        const db = readDB();
        const index = db.movies.findIndex(m => m.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Không tìm thấy phim' });
        }
        
        // Ghi đè/gộp dữ liệu cũ với dữ liệu mới
        db.movies[index] = { ...db.movies[index], ...req.body };
=======
// Cập nhật phim (Admin)
const updateMovie = (req, res) => {
    try {
        const db = readDB();
        const index = (db.movies || []).findIndex(m => m.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Không tìm thấy phim' });
        }
        db.movies[index] = { ...db.movies[index], ...req.body, updatedAt: new Date().toISOString() };
>>>>>>> Stashed changes
        writeDB(db);
        res.json(db.movies[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

<<<<<<< HEAD
/**
 * Xóa phim - DELETE /api/movies/:id
 * Quyền: Admin
 */
=======
<<<<<<< Updated upstream
>>>>>>> truong-nhom
const deleteMovie = async (req, res) => {
    try {
        const db = readDB();
        const index = db.movies.findIndex(m => m.id === req.params.id);
<<<<<<< HEAD
        
        if (index === -1) {
            return res.status(404).json({ error: 'Không tìm thấy phim' });
        }
        
        db.movies.splice(index, 1);  // Xóa phim khỏi mảng
=======
        if (index === -1) return res.status(404).json({ error: 'Không tìm thấy phim' });
=======
// Xóa phim (Admin)
const deleteMovie = (req, res) => {
    try {
        const db = readDB();
        const index = (db.movies || []).findIndex(m => m.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Không tìm thấy phim' });
        }
>>>>>>> Stashed changes
        db.movies.splice(index, 1);
>>>>>>> truong-nhom
        writeDB(db);
        res.json({ message: 'Xóa phim thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getMovies, getMovieById, createMovie, updateMovie, deleteMovie };
}