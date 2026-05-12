/**
 * AUTH ROUTER - Định tuyến các API xác thực
 * Module: authRoutes.js
 * Base path: /api/auth
 */

const express = require('express');
const { login, register, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * ĐĂNG NHẬP - POST /api/auth/login
 * Public - Không cần token
 * Body: { email, password }
 * Return: { token, user }
 */
router.post('/login', login);
/**
 * ĐĂNG KÝ - POST /api/auth/register
 * Public - Không cần token
 * Body: { fullName, username, email, password, phone? }
 * Return: { message, user }
 */
router.post('/register', register);

/**
 * LẤY THÔNG TIN USER HIỆN TẠI - GET /api/auth/me
 * Private - Cần token
 * Header: Authorization: Bearer <token>
 * Return: { id, fullName, username, email, ... }
 */
router.get('/me', verifyToken, getMe);

module.exports = router;