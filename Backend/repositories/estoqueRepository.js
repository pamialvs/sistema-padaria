// Arquivo: Backend/repositories/estoqueRepository.js
const db = require('../db');

async function createItemEstoque(item) {
    const script = `
        INSERT INTO Estoque (
            nomeItemEstoque, 
            custoItemEstoque, 
            quantidadeItemEstoque, 
            unidadeMedidaItemEstoque, 
            Fornecedor_idFornecedor, 
            Produto_idProduto
        ) 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    
    const values = [
        item.nome,
        item.custo,
        item.quantidade,
        item.unidade,
        item.idFornecedor, // Aqui entra o ID (Ex: 2 para Boitata)
        item.idProduto || null // Se não enviar produto, grava NULL (Ex: Material de Limpeza)
    ];

    const res = await db.query(script, values);
    return res.rows[0];
}

async function getAllEstoque() {
    // JOIN para trazer o nome do Fornecedor em vez de só o número ID
    // Isso facilita a leitura no Front-end
    const script = `
        SELECT 
            E.idItemEstoque,
            E.nomeItemEstoque,
            E.quantidadeItemEstoque,
            E.unidadeMedidaItemEstoque,
            F.nomeFornecedor
        FROM Estoque E
        JOIN Fornecedor F ON E.Fornecedor_idFornecedor = F.idFornecedor
        ORDER BY E.nomeItemEstoque ASC;
    `;
    const res = await db.query(script);
    return res.rows;
}

module.exports = { createItemEstoque, getAllEstoque };