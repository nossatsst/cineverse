const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDB, writeDB } = require('../config/database');

const SECRET_KEY = 'CINEVERSE_SECRET_KEY_2024';

const login = (req, res) => {
    try {
        const { email, password } = req.body;  // Đổi username thành email
        const db = readDB();
        
        // Tìm user theo email
        const user = db.users.find(u => u.email === email);
        
        if (!user) {
            return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
        }
        
        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
        }
        
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
            password: bcrypt.hashSync(password, 10),
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

const getMe = (req, res) => {
    try {
        const db = readDB();
        const user = db.users.find(u => u.id === req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { login, register, getMe };