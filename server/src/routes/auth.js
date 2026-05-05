const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/login', authController.login);
router.post('/hash-password', authController.hashPassword); // Utility endpoint

// Protected routes
router.get('/verify', authenticateToken, authController.verifyToken);

module.exports = router;
