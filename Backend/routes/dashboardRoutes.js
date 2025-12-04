const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboardController');

router.get('/full', controller.getDashboardFull); 

module.exports = router;