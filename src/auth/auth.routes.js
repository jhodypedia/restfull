const express = require('express');
const { register, login, forgotPassword, logout } = require('./auth.controller');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/logout', logout);

module.exports = router;
