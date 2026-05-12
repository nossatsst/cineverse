/**
 * AUTH MIDDLEWARE - Xác thực JWT và kiểm tra trạng thái tài khoản
 * Module: authMiddleware.js
 * 
 * Thứ tự sử dụng:
 * 1. verifyToken - Giải mã token, gắn user vào req
 * 2. isActiveUser - Kiểm tra tài khoản còn hoạt động
 * 3. isAdmin - Kiểm tra quyền admin
 */

const jwt = require('jsonwebtoken');
const { readDB } = require('../config/database');

const SECRET_KEY = 'CINEVERSE_SECRET_KEY_2024';  // Khóa bí mật (nên để trong .env)

/**
 * XÁC THỰC TOKEN - Middleware bắt buộc đầu tiên
 * Header yêu cầu: Authorization: Bearer <token>
 * Chức năng:
 * - Lấy token từ header
 * - Giải mã token bằng SECRET_KEY
 * - Gắn thông tin user (id, username, role) vào req.user
 * Lỗi trả về:
 * - 401: Không có token hoặc token hết hạn
 * - 403: Token không hợp lệ
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Kiểm tra có header Authorization không
    if (!authHeader) {
        return res.status(401).json({ error: 'Không có token xác thực' });
    }
    
    // Lấy token sau chữ "Bearer "
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token không hợp lệ' });
    }
    
    try {
        // Giải mã token
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;  // { id, username, role, iat, exp }
        next();
    } catch (error) {
        // Xử lý token hết hạn
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token đã hết hạn' });
        }
        // Xử lý token sai
        return res.status(403).json({ error: 'Token không hợp lệ' });
    }
};

/**
 * KIỂM TRA QUYỀN ADMIN - Middleware thứ hai (sau verifyToken)
 * Yêu cầu: req.user đã được gắn từ verifyToken
 * Chức năng:
 * - Kiểm tra role của user có phải admin không
 * Lỗi trả về:
 * - 401: Chưa xác thực
 * - 403: Không có quyền admin
 */
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Chưa xác thực' });
    }
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Yêu cầu quyền Admin' });
    }
    
    next();
};

/**
 * KIỂM TRA TÀI KHOẢN HOẠT ĐỘNG - Middleware kiểm tra status
 * Yêu cầu: req.user đã được gắn từ verifyToken
 * Chức năng:
 * - Kiểm tra user có tồn tại trong DB không
 * - Kiểm tra status có phải 'active' không
 * Lỗi trả về:
 * - 404: Không tìm thấy user
 * - 403: Tài khoản bị khóa (status !== 'active')
 */
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