const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboardController');

// GET http://localhost:3000/dashboard/resumo
router.get('/resumo', controller.getResumo);

module.exports = router;