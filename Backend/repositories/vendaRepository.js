const db = require('../db');

// Passo 1: Registrar a Venda (Cabeçalho)
async function createVenda(venda) {
    const script = `
        INSERT INTO Venda (
            valorUniVenda, 
            dataVenda, 
            formaPagamento, 
            quantidadeVenda, 
            Colaborador_idColaborador
        ) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING idVenda;
    `;
    // Nota: Segundo o PDF, valor e quantidade ficam na tabela Venda
    const values = [
        venda.valorTotal, 
        venda.data, 
        venda.pagamento, 
        venda.quantidadeTotal, 
        venda.idColaborador
    ];

    const res = await db.query(script, values);
    return res.rows[0]; // Retorna { idvenda: 1 }
}

// Passo 2: Vincular Produtos à Venda (ItensVenda)
async function addItemVenda(idVenda, idProduto) {
    const script = `
        INSERT INTO ItensVenda (Venda_idVenda, Produto_idProduto)
        VALUES ($1, $2);
    `;
    await db.query(script, [idVenda, idProduto]);
}

// Relatório de Vendas (Consulta 183 do PDF)
async function getAllVendas() {
    const script = `
        SELECT 
            V.idVenda,
            V.dataVenda,
            V.valorUniVenda,
            C.nomeColaborador,
            P.nomeProduto
        FROM Venda V
        JOIN Colaborador C ON V.Colaborador_idColaborador = C.idColaborador
        JOIN ItensVenda IV ON V.idVenda = IV.Venda_idVenda
        JOIN Produto P ON IV.Produto_idProduto = P.idProduto
        ORDER BY V.dataVenda DESC;
    `;
    const res = await db.query(script);
    return res.rows;
}

module.exports = { createVenda, addItemVenda, getAllVendas };