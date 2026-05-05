const { readDB } = require('../config/database');

// Middleware kiểm tra quyền Admin
const isAdmin = (req, res, next) => {
    try {
        // Kiểm tra user đã được gắn vào req từ middleware auth chưa
        if (!req.user) {
            return res.status(401).json({ error: 'Chưa xác thực người dùng' });
        }
        
        const db = readDB();
        const user = db.users.find(u => u.id === req.user.id);
        
        if (!user) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Bạn không có quyền truy cập. Yêu cầu quyền Admin.' });
        }
        
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
};

// Middleware kiểm tra quyền Admin hoặc chính user đó
const isAdminOrSelf = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Chưa xác thực người dùng' });
        }
        
        const db = readDB();
        const user = db.users.find(u => u.id === req.user.id);
        const targetUserId = req.params.id || req.body.userId;
        
        if (!user) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        
        // Cho phép nếu là admin hoặc chính user đó
        if (user.role === 'admin' || req.user.id === targetUserId) {
            next();
        } else {
            return res.status(403).json({ error: 'Bạn không có quyền thực hiện hành động này' });
        }
    } catch (error) {
        console.error('AdminOrSelf middleware error:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
};

// Middleware kiểm tra quyền Admin hoặc Staff
const isAdminOrStaff = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Chưa xác thực người dùng' });
        }
        
        const db = readDB();
        const user = db.users.find(u => u.id === req.user.id);
        
        if (!user) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        
        if (user.role === 'admin' || user.role === 'staff') {
            next();
        } else {
            return res.status(403).json({ error: 'Bạn không có quyền truy cập. Yêu cầu quyền Admin hoặc Staff.' });
        }
    } catch (error) {
        console.error('AdminOrStaff middleware error:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
};

module.exports = { isAdmin, isAdminOrSelf, isAdminOrStaff };