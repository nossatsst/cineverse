/**
 * AUTH CONTROLLER - Xử lý đăng nhập/đăng ký/lấy thông tin user
 * Module: authController.js
 * Dependencies: bcryptjs, jsonwebtoken, database module
 */

const bcrypt = require('bcryptjs');      // Mã hóa & so sánh mật khẩu
const jwt = require('jsonwebtoken');     // Tạo & xác thực token JWT
const { readDB, writeDB } = require('../config/database');

const SECRET_KEY = 'CINEVERSE_SECRET_KEY_2024';  // Khóa ký token (nên đặt trong .env)

/**
 * ĐĂNG NHẬP - POST /api/auth/login
 * Body: { email, password }
 * Return: { token, user }
 */
const login = (req, res) => {
    try {
        const { email, password } = req.body;
        const db = readDB();
        
        const user = db.users.find(u => u.email === email);
        if (!user) return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
        
        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
        
        // Tạo token hết hạn sau 7 ngày
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            SECRET_KEY,
            { expiresIn: '7d' }
        );
        
        const { password: _, ...userWithoutPassword } = user;
        res.json({ token, user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * ĐĂNG KÝ - POST /api/auth/register
 * Body: { fullName, username, email, password, phone? }
 * Return: { message, user }
 */
const register = (req, res) => {
    try {
        const { fullName, username, email, password, phone } = req.body;
        const db = readDB();
        
        if (db.users.find(u => u.username === username)) {
            return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });
        }
        if (db.users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'Email đã được sử dụng' });
        }
        
        const newUser = {
            id: `user_${Date.now()}`,
            fullName,
            username,
            email,
            password: bcrypt.hashSync(password, 10),  // Hash mật khẩu
            phone: phone || '',
            role: 'user',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        
        db.users.push(newUser);
        writeDB(db);
        
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ message: 'Đăng ký thành công', user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * LẤY THÔNG TIN USER HIỆN TẠI - GET /api/auth/me
 * Header: Authorization: Bearer <token>
 * Return: user info (không có password)
 */
const getMe = (req, res) => {
    try {
        const db = readDB();
        const user = db.users.find(u => u.id === req.user.id);
        if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        
        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { login, register, getMe };