const db = require('../db');

async function createCliente(cliente) {
    const script = `
        INSERT INTO Cliente (nomeCliente, emailCliente, telefoneCliente, enderecoCliente) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
    `;
    const values = [cliente.nome, cliente.email, cliente.telefone, cliente.endereco];
    const res = await db.query(script, values);
    return res.rows[0];
}

async function getAllClientes() {
    // Nota: A tabela Cliente ainda não tem relação direta com Vendas no modelo original.
    // Por isso, não conseguimos calcular "TotalCompras" real via SQL simples sem alterar a tabela Venda.
    // Vamos retornar os dados cadastrais puros por enquanto.
    const script = `SELECT * FROM Cliente ORDER BY nomeCliente ASC`;
    const res = await db.query(script);
    return res.rows;
}

// Se quiseres apagar (Opcional para a PoC)
async function deleteCliente(id) {
    await db.query('DELETE FROM Cliente WHERE idCliente = $1', [id]);
}

module.exports = { createCliente, getAllClientes, deleteCliente };