const repo = require('../repositories/clienteRepository');

async function cadastrar(req, res) {
    const { nome } = req.body;
    if (!nome) {
        return res.status(400).json({ erro: "Nome do cliente é obrigatório." });
    }
    try {
        const novo = await repo.createCliente(req.body);
        return res.status(201).json(novo);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao cadastrar cliente." });
    }
}

async function listar(req, res) {
    try {
        const lista = await repo.getAllClientes();
        return res.status(200).json(lista);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao buscar clientes." });
    }
}

async function excluir(req, res) {
    try {
        await repo.deleteCliente(req.params.id);
        return res.status(204).send();
    } catch (erro) {
        return res.status(500).json({ erro: "Erro ao excluir." });
    }
}

module.exports = { cadastrar, listar, excluir };