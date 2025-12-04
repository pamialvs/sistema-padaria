const repo = require('../repositories/fornecedorRepository');

async function cadastrar(req, res) {
    if (!req.body.nome) return res.status(400).json({ erro: "Nome é obrigatório" });
    try {
        const novo = await repo.createFornecedor(req.body);
        res.status(201).json(novo);
    } catch (err) { res.status(500).json({ erro: err.message }); }
}

async function listar(req, res) {
    try {
        const lista = await repo.getAllFornecedores();
        res.status(200).json(lista);
    } catch (err) { res.status(500).json({ erro: err.message }); }
}

module.exports = { cadastrar, listar };