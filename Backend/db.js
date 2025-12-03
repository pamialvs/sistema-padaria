// Arquivo: Backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

// Verificando se a senha foi carregada (Debug)
if (!process.env.DB_PASSWORD) {
    console.error("ERRO: A variável DB_PASSWORD não foi encontrada. Verifique se o arquivo .env está na pasta Backend.");
}

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Teste de conexão
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('ERRO AO CONECTAR:', err.message);
    } else {
        console.log('CONEXÃO SUCESSO! O Banco Pão Dourado respondeu:', res.rows[0].now);
    }
});

module.exports = pool;