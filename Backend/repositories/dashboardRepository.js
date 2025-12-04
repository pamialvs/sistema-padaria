const db = require('../db');

async function getVendasHoje() {
    const script = `
        SELECT SUM(valorUniVenda) AS total_hoje 
        FROM Venda 
        WHERE dataVenda = CURRENT_DATE;
    `;
    const res = await db.query(script);
    // Se não tiver vendas, o SUM retorna NULL. Vamos converter para 0.
    return res.rows[0].total_hoje || 0.00;
}

module.exports = { getVendasHoje };