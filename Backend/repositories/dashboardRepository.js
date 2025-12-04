const db = require('../db');

// KPI: Total vendido hoje
async function getVendasHoje() {
    const script = `SELECT SUM(valorUniVenda) AS total FROM Venda WHERE dataVenda = CURRENT_DATE`;
    const res = await db.query(script);
    return res.rows[0].total || 0;
}

// Gráfico: Vendas por dia (Últimos 7 dias)
async function getGraficoVendas() {
    const script = `
        SELECT TO_CHAR(dataVenda, 'DD/MM') as dia, SUM(valorUniVenda) as total 
        FROM Venda 
        GROUP BY dataVenda 
        ORDER BY dataVenda ASC 
        LIMIT 7
    `;
    const res = await db.query(script);
    return res.rows;
}

// Gráfico: Top 5 Produtos Mais Vendidos
async function getTopProdutos() {
    const script = `
        SELECT P.nomeProduto as name, COUNT(IV.Produto_idProduto) as quantidade
        FROM ItensVenda IV
        JOIN Produto P ON IV.Produto_idProduto = P.idProduto
        GROUP BY P.nomeProduto
        ORDER BY quantidade DESC
        LIMIT 5
    `;
    const res = await db.query(script);
    return res.rows;
}

// Tabela: Últimas 5 Transações
async function getTransacoesRecentes() {
    const script = `
        SELECT V.idVenda as id, P.nomeProduto as produto, V.valorUniVenda as valor, 
               TO_CHAR(V.dataVenda, 'DD/MM/YYYY') as data, 'Concluído' as status
        FROM Venda V
        JOIN ItensVenda IV ON V.idVenda = IV.Venda_idVenda
        JOIN Produto P ON IV.Produto_idProduto = P.idProduto
        ORDER BY V.idVenda DESC
        LIMIT 5
    `;
    const res = await db.query(script);
    return res.rows;
}

module.exports = { getVendasHoje, getGraficoVendas, getTopProdutos, getTransacoesRecentes };