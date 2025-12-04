const express = require('express');
const router = express.Router();
const controller = require('../controllers/estoqueController');

router.post('/', controller.cadastrar);
router.get('/', controller.listar);

module.exports = router;