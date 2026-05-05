const { readDB, writeDB } = require('../config/database');
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
    try {
        const db = readDB();
        const users = db.users.map(({ password, ...user }) => user);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const db = readDB();
        const index = db.users.findIndex(u => u.id === req.params.id);
        if (index === -1) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        db.users[index] = { ...db.users[index], ...req.body };
        writeDB(db);
        const { password: _, ...userWithoutPassword } = db.users[index];
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const db = readDB();
        const index = db.users.findIndex(u => u.id === req.params.id);
        if (index === -1) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        if (db.users[index].role === 'admin') return res.status(403).json({ error: 'Không thể xóa Admin' });
        db.users.splice(index, 1);
        writeDB(db);
        res.json({ message: 'Xóa người dùng thành công' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { fullName, username, email, password, phone, role } = req.body;
        const db = readDB();
        if (db.users.find(u => u.username === username)) return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });
        if (db.users.find(u => u.email === email)) return res.status(400).json({ error: 'Email đã được sử dụng' });
        
        const newUser = {
            id: `user_${Date.now()}`,
            fullName, username, email,
            password: bcrypt.hashSync(password, 10),
            phone: phone || '',
            role: role || 'user',
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        db.users.push(newUser);
        writeDB(db);
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllUsers, updateUser, deleteUser, createUser };