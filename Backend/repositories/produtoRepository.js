// Arquivo: Backend/repositories/produtoRepository.js
const db = require('../db');

// Função para cadastrar produto
async function createProduto(produto) {
    const script = `
        INSERT INTO Produto (
            nomeProduto, 
            dataVencimentoProduto, 
            tipoProduto, 
            origemProduto
        ) 
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    
    const valores = [
        produto.nome,
        produto.dataVencimento, 
        produto.tipo,
        produto.origem 
    ];

    const res = await db.query(script, valores);
    return res.rows[0];
}

// Função para listar produtos
async function getAllProdutos() {
    const script = `SELECT * FROM Produto ORDER BY nomeProduto ASC`;
    const res = await db.query(script);
    return res.rows;
}

module.exports = { createProduto, getAllProdutos };