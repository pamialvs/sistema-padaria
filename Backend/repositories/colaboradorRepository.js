// Arquivo: Backend/repositories/colaboradorRepository.js
const db = require('../db');

// Busca um usuário pelo email para verificar login
async function findUserByEmail(email) {
    const script = `SELECT * FROM Colaborador WHERE emailColaborador = $1`;
    const res = await db.query(script, [email]);
    
    if (res.rows.length > 0) {
        const row = res.rows[0];
        // Mapeia do formato Banco (snake_case) para o formato Aplicação (camelCase)
        // O authController espera: id, username, email, password, cargo
        return {
            id: row.idcolaborador,
            username: row.nomecolaborador,
            email: row.emailcolaborador,
            password: row.senhacolaborador, // A senha criptografada
            cargo: row.cargocolaborador
        };
    }
    return null;
}

// Cria um usuário via tela de Cadastro (Versão Simplificada)
async function createUser(user) {
    // Definimos valores padrão para os campos obrigatórios do RH que o cadastro simples não envia
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
        user.username,  // Vem do front como 'username', salvamos em 'nomeColaborador'
        user.email,
        user.password,  // Senha já hashada pelo bcrypt
        user.cargo || 'Atendente' // Se não vier cargo, assume Atendente
    ];

    const res = await db.query(script, values);
    return res.rows[0];
}

// --- FUNÇÕES DE RH (LEGADO) ---

// Mantemos a função original caso o gerente queira cadastrar pelo painel completo
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

async function getAllColaboradores() {
    try {
        const scriptSQL = `SELECT * FROM Colaborador ORDER BY nomeColaborador ASC`;
        const res = await db.query(scriptSQL);
        return res.rows;
    } catch (error) {
        throw error;
    }
}

// Exportando TODAS as funções
module.exports = { 
    createColaborador, 
    getAllColaboradores,
    findUserByEmail, // <--- Agora existe!
    createUser       // <--- Agora existe!
};