const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

// Login routes
router.get('/login', AuthController.showLoginForm);
router.post('/login', AuthController.login);

// Register routes
router.get('/register', AuthController.showRegisterForm);
router.post('/register', AuthController.register);

// Logout
router.get('/logout', AuthController.logout);

module.exports = router;
