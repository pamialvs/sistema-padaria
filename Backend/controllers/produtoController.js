// Arquivo: Backend/controllers/produtoController.js
const repo = require('../repositories/produtoRepository');

async function cadastrar(req, res) {
    const dados = req.body;

    // Validação: Nome é obrigatório (NOT NULL no banco) [cite: 70]
    if (!dados.nome) {
        return res.status(400).json({ erro: "Nome do produto é obrigatório." });
    }

    try {
        const produto = await repo.createProduto(dados);
        res.status(201).json(produto);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro interno ao cadastrar produto." });
    }
}

async function listar(req, res) {
    try {
        const lista = await repo.getAllProdutos();
        res.status(200).json(lista);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao buscar produtos." });
    }
}

module.exports = { cadastrar, listar };