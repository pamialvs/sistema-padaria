
const repo = require('../repositories/estoqueRepository');

async function cadastrar(req, res) {
    const dados = req.body;

   
    if (!dados.nome || !dados.idFornecedor) {
        return res.status(400).json({ erro: "Nome do item e ID do Fornecedor são obrigatórios." });
    }

    try {
        const itemCriado = await repo.createItemEstoque(dados);
        res.status(201).json(itemCriado);
    } catch (erro) {
        console.error(erro);
 
        if (erro.code === '23503') {
            return res.status(400).json({ erro: "O Fornecedor ou Produto informado não existe." });
        }
        res.status(500).json({ erro: "Erro interno ao cadastrar estoque." });
    }
}

async function listar(req, res) {
    try {
        const lista = await repo.getAllEstoque();
        res.status(200).json(lista);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao buscar estoque." });
    }
}

module.exports = { cadastrar, listar };