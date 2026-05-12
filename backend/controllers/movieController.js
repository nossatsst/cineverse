/**
 * MOVIE CONTROLLER - Quản lý phim
 * Module: movieController.js
 */

const { readDB, writeDB } = require('../config/database');

const getMovies = (req, res) => {

/**
 * Lấy danh sách tất cả phim - GET /api/movies
 * Public: Không cần auth
 */
const getMovies = async (req, res) => {
    try {
        const db = readDB();
        let movies = db.movies || [];
        const { search, category, minPrice, maxPrice, sortBy } = req.query;
        
        // Tìm kiếm theo tên
        if (search) {
            movies = movies.filter(m => 
                m.title.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        // Lọc theo thể loại
        if (category && category !== 'all') {
            movies = movies.filter(m => m.category === category);
        }
        
        // Lọc theo giá
        if (minPrice) {
            movies = movies.filter(m => m.price >= parseInt(minPrice));
        }
        if (maxPrice) {
            movies = movies.filter(m => m.price <= parseInt(maxPrice));
        }
        
        // Sắp xếp
        if (sortBy === 'price_asc') {
            movies.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_desc') {
            movies.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
            movies.sort((a, b) => b.rating - a.rating);
        }
        
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/**
 * Lấy chi tiết phim theo ID - GET /api/movies/:id
 * Public
 */

const getMovieById = async (req, res) => {
    try {
        const db = readDB();
        const movie = db.movies.find(m => m.id === req.params.id);
        
        if (!movie) {
            return res.status(404).json({ error: 'Không tìm thấy phim' });
        }
        
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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
        
        db.movies.push(newMovie);
        writeDB(db);
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Cập nhật thông tin phim - PUT /api/movies/:id
 * Body: Các field cần cập nhật
 * Quyền: Admin
 */
const updateMovie = async (req, res) => {
    try {
        const db = readDB();
        const index = db.movies.findIndex(m => m.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Không tìm thấy phim' });
        }
        
        // Ghi đè/gộp dữ liệu cũ với dữ liệu mới
        db.movies[index] = { ...db.movies[index], ...req.body };
        writeDB(db);
        res.json(db.movies[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Xóa phim - DELETE /api/movies/:id
 * Quyền: Admin
 */
const deleteMovie = async (req, res) => {
    try {
        const db = readDB();
        const index = db.movies.findIndex(m => m.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Không tìm thấy phim' });
        }
        
        db.movies.splice(index, 1);  // Xóa phim khỏi mảng
        writeDB(db);
        res.json({ message: 'Xóa phim thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getMovies, getMovieById, createMovie, updateMovie, deleteMovie };
}