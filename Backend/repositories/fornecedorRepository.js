const db = require('../db');

async function createFornecedor(fornecedor) {
    const script = `
        INSERT INTO Fornecedor (nomeFornecedor, contatoFornecedor, enderecoFornecedor) 
        VALUES ($1, $2, $3) RETURNING *;
    `;
    const values = [fornecedor.nome, fornecedor.contato, fornecedor.endereco];
    const res = await db.query(script, values);
    return res.rows[0];
}

async function getAllFornecedores() {
    const res = await db.query('SELECT * FROM Fornecedor ORDER BY nomeFornecedor ASC');
    return res.rows;
}

module.exports = { createFornecedor, getAllFornecedores };