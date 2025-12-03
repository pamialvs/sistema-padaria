// Arquivo: Backend/repositories/colaboradorRepository.js
const db = require('../db');

// Função 1: Criar (INSERT)
async function createColaborador(colaborador) {
    const scriptSQL = `
        INSERT INTO Colaborador (
            nomeColaborador, 
            cargoColaborador, 
            dataInicioColaborador, 
            experienciaColaborador, 
            salarioColaborador, 
            funcaoColaborador, 
            statusColaborador
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING idColaborador, nomeColaborador; 
    `;
    
    const valores = [
        colaborador.nome,
        colaborador.cargo,
        colaborador.dataInicio,
        colaborador.experiencia,
        colaborador.salario,
        colaborador.funcao,
        colaborador.status
    ];

    try {
        const res = await db.query(scriptSQL, valores);
        return res.rows[0];
    } catch (error) {
        throw error;
    }
}

// Função 2: Listar (SELECT) - <--- VERIFIQUE SE ISTO ESTÁ NO SEU ARQUIVO
async function getAllColaboradores() {
    try {
        const scriptSQL = `SELECT * FROM Colaborador ORDER BY nomeColaborador ASC`;
        const res = await db.query(scriptSQL);
        return res.rows;
    } catch (error) {
        throw error;
    }
}

// Exportação - <--- O ERRO GERALMENTE ESTÁ AQUI
// Precisamos exportar AMBAS as funções para que o Controller as enxergue
module.exports = { 
    createColaborador, 
    getAllColaboradores 
};