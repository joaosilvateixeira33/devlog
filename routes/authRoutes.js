const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UsersController');
const { authenticate } = require('../middlewares/authMiddleware');

router.get('/login', UserController.loginForm);
router.post('/login', UserController.login);
router.get('/logout', UserController.logout);
router.get('/register', UserController.registerForm);
router.post('/register', UserController.register);
router.get('/dashboard', authenticate, UserController.dashboard);

module.exports = router;