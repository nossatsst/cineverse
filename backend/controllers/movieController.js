const { readDB, writeDB } = require('../config/database');

// Lấy danh sách phim
const getMovies = (req, res) => {
    try {
        const db = readDB();
        res.json(db.movies || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
<<<<<<< Updated upstream
const getMovieById = async (req, res) => {
    try {
        const db = readDB();
        const movie = db.movies.find(m => m.id === req.params.id);
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
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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
        db.movies.push(newMovie);
        writeDB(db);
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

<<<<<<< Updated upstream
const updateMovie = async (req, res) => {
    try {
        const db = readDB();
        const index = db.movies.findIndex(m => m.id === req.params.id);
        if (index === -1) return res.status(404).json({ error: 'Không tìm thấy phim' });
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

<<<<<<< Updated upstream
const deleteMovie = async (req, res) => {
    try {
        const db = readDB();
        const index = db.movies.findIndex(m => m.id === req.params.id);
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
        writeDB(db);
        res.json({ message: 'Xóa phim thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getMovies, getMovieById, createMovie, updateMovie, deleteMovie };