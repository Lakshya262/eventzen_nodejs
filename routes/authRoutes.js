const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// User Registration
router.post('/register', register);

// User Login
router.post('/login', login);

// Get User Profile
router.get('/profile', protect, getProfile);

module.exports = router;
