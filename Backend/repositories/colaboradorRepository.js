// Arquivo: Backend/repositories/colaboradorRepository.js
const db = require('../db');

// --- ÁREA DE AUTENTICAÇÃO (LOGIN/REGISTER) ---

// 1. Busca usuário para o Login (Chamado pelo authController.login)
async function findUserByEmail(email) {
    // Mapeamos as colunas do banco (snake_case/português) para o objeto JS
    const script = `SELECT * FROM Colaborador WHERE emailColaborador = $1`;
    const res = await db.query(script, [email]);
    
    if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
            id: row.idcolaborador,
            username: row.nomecolaborador,
            email: row.emailcolaborador,
            password: row.senhacolaborador, // A senha hashada
            cargo: row.cargocolaborador
        };
    }
    return null;
}

// 2. Cria usuário pelo Cadastro do Site (Chamado pelo authController.register)
async function createUser(user) {
    const script = `
        INSERT INTO Colaborador (
            nomeColaborador, 
            emailColaborador, 
            senhaColaborador,
            cargoColaborador,
            dataInicioColaborador,
            salarioColaborador,
            statusColaborador
        ) 
        VALUES ($1, $2, $3, $4, CURRENT_DATE, 0.00, 1)
        RETURNING idColaborador, nomeColaborador;
    `;
    
    const values = [
        user.username, // O controller manda 'username', gravamos em 'nomeColaborador'
        user.email,
        user.password, // Senha já criptografada
        user.cargo || 'Atendente'
    ];

    const res = await db.query(script, values);
    return res.rows[0];
}

// --- ÁREA DE RH (LEGADO/PAINEL ADM) ---

// 3. Criação completa (Usado se tiver um painel de RH futuro)
async function createColaborador(colaborador) {
    const scriptSQL = `
        INSERT INTO Colaborador (
            nomeColaborador, cargoColaborador, dataInicioColaborador, 
            experienciaColaborador, salarioColaborador, funcaoColaborador, statusColaborador
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING idColaborador; 
    `;
    const values = [
        colaborador.nome, colaborador.cargo, colaborador.dataInicio,
        colaborador.experiencia, colaborador.salario, colaborador.funcao, colaborador.status
    ];
    const res = await db.query(scriptSQL, values);
    return res.rows[0];
}

// 4. Listagem (Usado na rota GET /colaboradores)
async function getAllColaboradores() {
    const res = await db.query(`SELECT * FROM Colaborador ORDER BY nomeColaborador ASC`);
    return res.rows;
}

// EXPORTAÇÃO COMPLETA
module.exports = { 
    createColaborador, 
    getAllColaboradores,
    findUserByEmail, // <--- Agora o authController vai encontrar isso!
    createUser       // <--- E isso também!
};