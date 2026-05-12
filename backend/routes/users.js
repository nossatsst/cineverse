/**
 * USER ROUTER - Quản lý người dùng (Admin)
 * Module: userRoutes.js
 * Base path: /api/users
 * Tất cả routes đều yêu cầu quyền ADMIN
 */
const express = require('express');
const { getAllUsers, updateUser, deleteUser, createUser } = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * LẤY DANH SÁCH NGƯỜI DÙNG - GET /api/users
 * Private - Cần token + Admin
 * Trả về: Danh sách users (không bao gồm password)
 */
router.get('/', verifyToken, isAdmin, getAllUsers);

/**
 * TẠO NGƯỜI DÙNG MỚI - POST /api/users
 * Private - Cần token + Admin
 * Body: { fullName, username, email, password, phone, role }
 * Khác với register: Admin có thể set role (user hoặc admin)
 */
router.post('/', verifyToken, isAdmin, createUser);

/**
 * CẬP NHẬT NGƯỜI DÙNG - PUT /api/users/:id
 * Private - Cần token + Admin
 * Params: id (userId cần cập nhật)
 * Body: { fullName, email, phone, role, status, ... }
 */
router.put('/:id', verifyToken, isAdmin, updateUser);

/**
 * XÓA NGƯỜI DÙNG - DELETE /api/users/:id
 * Private - Cần token + Admin
 * Params: id (userId cần xóa)
 * Lưu ý: Không thể xóa tài khoản admin
 */
router.delete('/:id', verifyToken, isAdmin, deleteUser);

module.exports = router;