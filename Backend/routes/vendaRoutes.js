const express = require('express');
const router = express.Router();
const controller = require('../controllers/vendaController');

router.post('/', controller.registrarVenda);
router.get('/', controller.listar);

module.exports = router;
