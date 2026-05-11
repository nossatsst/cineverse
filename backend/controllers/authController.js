const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDB, writeDB } = require('../config/database');

const SECRET_KEY = 'CINEVERSE_SECRET_KEY_2024';

const login = (req, res) => {
    try {
        const { email, password } = req.body;
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
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const db = readDB();
        const userIndex = db.users.findIndex(u => u.id === req.user.id);
        
        if (userIndex === -1) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        
        const user = db.users[userIndex];
        const isValid = bcrypt.compareSync(oldPassword, user.password);
        
        if (!isValid) {
            return res.status(401).json({ error: 'Mật khẩu cũ không đúng' });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
        }
        
        user.password = bcrypt.hashSync(newPassword, 10);
        db.users[userIndex] = user;
        writeDB(db);
        
        res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const db = readDB();
        const user = db.users.find(u => u.email === email);
        
        if (!user) {
            return res.status(404).json({ error: 'Email không tồn tại trong hệ thống' });
        }
        
        // Tạo token reset
        const resetToken = jwt.sign(
            { id: user.id, email: user.email },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        
        // Lưu token (trong thực tế nên lưu vào database)
        // Ở đây tạm thời trả về token để test
        res.json({ 
            message: 'Link đặt lại mật khẩu đã được gửi!',
            resetToken: resetToken  // Trong thực tế, gửi email chứa link
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const decoded = jwt.verify(token, SECRET_KEY);
        const db = readDB();
        const userIndex = db.users.findIndex(u => u.id === decoded.id);
        
        if (userIndex === -1) {
            return res.status(404).json({ error: 'Người dùng không tồn tại' });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' });
        }
        
        db.users[userIndex].password = bcrypt.hashSync(newPassword, 10);
        writeDB(db);
        
        res.json({ message: 'Đặt lại mật khẩu thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};

module.exports = { login, register, getMe, changePassword, forgotPassword, resetPassword };

