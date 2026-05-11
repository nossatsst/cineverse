const express = require('express');
const { 
    login, 
    register, 
    getMe, 
    changePassword,      // ← THÊM
    forgotPassword,      // ← THÊM
    resetPassword        // ← THÊM
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', verifyToken, getMe);
router.put('/change-password', verifyToken, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;