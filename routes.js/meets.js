const express = require('express');
const router = express.Router();
const MeetsController = require('../controllers/meets');
const checkAuth = require('../middleware/check-auth');

router.get('/', checkAuth, MeetsController.getPassMeetsOfUser)

module.exports = router