// Arquivo: Backend/routes/produtoRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/produtoController');

router.post('/', controller.cadastrar);
router.get('/', controller.listar); // Quando acessa /produtos, cai aqui

module.exports = router;