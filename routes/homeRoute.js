const express = require('express');
const router = express.Router();
const homeController = require('../controllers/HomeControler')

router.get('/', homeController.home);

module.exports = router;