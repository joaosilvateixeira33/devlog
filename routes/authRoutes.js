const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UsersController');

router.get('/login', UserController.loginForm);
router.post('/login', UserController.login);
router.get('/logout', UserController.logout);

module.exports = router;