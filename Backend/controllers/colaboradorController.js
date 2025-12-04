
const repo = require('../repositories/colaboradorRepository');


async function cadastrar(req, res) {
   
    const dados = req.body;
    
   
    if (!dados.nome) {
        return res.status(400).json({ erro: "O nome do colaborador é obrigatório." });
    }

    try {
        const novoColaborador = await repo.createColaborador(dados);
       
        return res.status(201).json(novoColaborador);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno no servidor." });
    }
}

module.exports = { cadastrar };


async function listar(req, res) {
    try {
   
        const lista = await repo.getAllColaboradores();
        return res.status(200).json(lista);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao buscar colaboradores." });
    }
}


module.exports = { cadastrar, listar };