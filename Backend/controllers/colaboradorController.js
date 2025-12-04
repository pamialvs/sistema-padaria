// Arquivo: Backend/controllers/colaboradorController.js
const repo = require('../repositories/colaboradorRepository');

// Função que será executada quando a rota POST /colaboradores for chamada
async function cadastrar(req, res) {
    // req.body contém os dados enviados pelo Front-end (JSON)
    const dados = req.body;
    
    // Validação básica (Regra de Negócio)
    if (!dados.nome) {
        return res.status(400).json({ erro: "O nome do colaborador é obrigatório." });
    }

    try {
        const novoColaborador = await repo.createColaborador(dados);
        // Retorna HTTP 201 (Created) e o objeto criado
        return res.status(201).json(novoColaborador);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno no servidor." });
    }
}

module.exports = { cadastrar };

// Função para listar todos os colaboradores
async function listar(req, res) {
    try {
        // Chama a função getAllColaboradores que já criamos no Repository
        const lista = await repo.getAllColaboradores();
        return res.status(200).json(lista);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao buscar colaboradores." });
    }
}

// ATENÇÃO: Adicione 'listar' no exports
module.exports = { cadastrar, listar };