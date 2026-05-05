const jwt = require('jsonwebtoken');
const { readDB } = require('../config/database');

const SECRET_KEY = 'CINEVERSE_SECRET_KEY_2024';

// Middleware xác thực token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ error: 'Không có token xác thực' });
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token không hợp lệ' });
    }
    
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token đã hết hạn' });
        }
        return res.status(403).json({ error: 'Token không hợp lệ' });
    }
};

// Middleware kiểm tra quyền Admin
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Chưa xác thực' });
    }
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Yêu cầu quyền Admin' });
    }
    
    next();
};

// Middleware kiểm tra user có tồn tại và active không
const isActiveUser = (req, res, next) => {
    try {
        const db = readDB();
        const user = db.users.find(u => u.id === req.user.id);
        
        if (!user) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        
        if (user.status !== 'active') {
            return res.status(403).json({ error: 'Tài khoản đã bị khóa' });
        }
        
        next();
    } catch (error) {
        console.error('IsActiveUser error:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
};

module.exports = { verifyToken, isAdmin, isActiveUser, SECRET_KEY };