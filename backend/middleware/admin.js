/**
 * AUTH MIDDLEWARE - Phân quyền truy cập
 * Module: authMiddleware.js
 * Yêu cầu: Phải chạy sau middleware xác thực JWT (gắn req.user)
 */

const { readDB } = require('../config/database');

/**
 * Kiểm tra quyền ADMIN
 * Chỉ cho phép user có role = 'admin' tiếp tục
 * Sử dụng cho: Xóa user, tạo phim, xem all bookings, ...
 * Cách dùng: router.delete('/users/:id', authenticateToken, isAdmin, deleteUser)
 */
const isAdmin = (req, res, next) => {
    try {
        // Kiểm tra đã xác thực user chưa
        if (!req.user) {
            return res.status(401).json({ error: 'Chưa xác thực người dùng' });
        }
        
        const db = readDB();
        const user = db.users.find(u => u.id === req.user.id);
        
        if (!user) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        
        // Kiểm tra role
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Bạn không có quyền truy cập. Yêu cầu quyền Admin.' });
        }
        
        next();  // Cho phép đi tiếp
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ error: 'Lỗi server' });
    }
};

/**
 * Kiểm tra quyền ADMIN hoặc CHÍNH USER ĐÓ
 * Cho phép nếu là admin HOẶC user đang thao tác với chính tài khoản của mình
 * Sử dụng cho: Cập nhật thông tin cá nhân, xem profile, ...
 * Cách dùng: router.put('/users/:id', authenticateToken, isAdminOrSelf, updateUser)
 */
const isAdminOrSelf = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Chưa xác thực người dùng' });
        }
        
        const db = readDB();
        const user = db.users.find(u => u.id === req.user.id);
        // Lấy ID từ params hoặc từ body (linh hoạt)
        const targetUserId = req.params.id || req.body.userId;
        
        if (!user) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        
        // Cho phép nếu là admin HOẶC chính user đó
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

/**
 * Kiểm tra quyền ADMIN hoặc STAFF (nhân viên)
 * Cho phép cả admin và staff, không cho user thường
 * Sử dụng cho: Quản lý đặt vé, xem doanh thu, ...
 * Cách dùng: router.get('/bookings', authenticateToken, isAdminOrStaff, getAllBookings)
 */
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
        
        // Cho phép admin hoặc staff
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