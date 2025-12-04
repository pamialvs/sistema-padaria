const express = require('express');
const router = express.Router();
const controller = require('../controllers/clienteController');

router.post('/', controller.cadastrar);
router.get('/', controller.listar);
router.delete('/:id', controller.excluir);

module.exports = router;