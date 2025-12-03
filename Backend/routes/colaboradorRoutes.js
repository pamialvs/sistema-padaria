// Arquivo: Backend/routes/colaboradorRoutes.js
const express = require('express');
const router = express.Router();

// Importa o controlador que contém a lógica de negócio
const controller = require('../controllers/colaboradorController');

// Rota para CADASTRAR um novo colaborador
// Verbo HTTP: POST
// URL Final: http://localhost:3000/colaboradores/
router.post('/', controller.cadastrar);

// Rota para LISTAR todos os colaboradores
// Verbo HTTP: GET
// URL Final: http://localhost:3000/colaboradores/
router.get('/', controller.listar);

module.exports = router;