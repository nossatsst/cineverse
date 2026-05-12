/**
 * USER CONTROLLER - Quản lý người dùng (Admin)
 * Module: userController.js
 */

const { readDB, writeDB } = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * Lấy danh sách tất cả người dùng - GET /api/users
 * Quyền: Admin
 * Lưu ý: Ẩn password của tất cả users trước khi trả về
 */
const getAllUsers = async (req, res) => {
    try {
        const db = readDB();
        // Loại bỏ trường password khỏi mỗi user
        const users = db.users.map(({ password, ...user }) => user);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Cập nhật thông tin user - PUT /api/users/:id
 * Body: { fullName, email, phone, role, status, ... }
 * Quyền: Admin
 */
const updateUser = async (req, res) => {
    try {
        const db = readDB();
        const index = db.users.findIndex(u => u.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        
        // Gộp dữ liệu cũ và mới
        db.users[index] = { ...db.users[index], ...req.body };
        writeDB(db);
        
        // Loại bỏ password trước khi trả về
        const { password: _, ...userWithoutPassword } = db.users[index];
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Xóa người dùng - DELETE /api/users/:id
 * Quyền: Admin
 * Lưu ý: Không cho phép xóa tài khoản Admin
 */
const deleteUser = async (req, res) => {
    try {
        const db = readDB();
        const index = db.users.findIndex(u => u.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        
        // Kiểm tra không cho xóa admin
        if (db.users[index].role === 'admin') {
            return res.status(403).json({ error: 'Không thể xóa Admin' });
        }
        
        db.users.splice(index, 1);  // Xóa user khỏi mảng
        writeDB(db);
        res.json({ message: 'Xóa người dùng thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Tạo người dùng mới (bởi Admin) - POST /api/users
 * Body: { fullName, username, email, password, phone, role }
 * Quyền: Admin
 * Khác với register: Admin có thể set role (user/admin)
 */
const createUser = async (req, res) => {
    try {
        const { fullName, username, email, password, phone, role } = req.body;
        const db = readDB();
        
        // Kiểm tra username đã tồn tại
        if (db.users.find(u => u.username === username)) {
            return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });
        }
        
        // Kiểm tra email đã tồn tại
        if (db.users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'Email đã được sử dụng' });
        }
        
        // Tạo user mới
        const newUser = {
            id: `user_${Date.now()}`,
            fullName,
            username,
            email,
            password: bcrypt.hashSync(password, 10),  // Hash mật khẩu
            phone: phone || '',
            role: role || 'user',                      // Admin có thể set role
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        
        db.users.push(newUser);
        writeDB(db);
        
        // Loại bỏ password trước khi trả về
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllUsers, updateUser, deleteUser, createUser };