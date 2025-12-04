const repo = require('../repositories/dashboardRepository');

async function getResumo(req, res) {
    try {
        const totalHoje = await repo.getVendasHoje();
        res.json({ 
            vendasHoje: parseFloat(totalHoje) // Garante que seja número
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao calcular dashboard" });
    }
}

module.exports = { getResumo };