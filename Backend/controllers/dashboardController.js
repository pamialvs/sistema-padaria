const repo = require('../repositories/dashboardRepository');

async function getDashboardFull(req, res) {
    try {
       
        const [vendasHoje, graficoVendas, graficoProdutos, transacoes] = await Promise.all([
            repo.getVendasHoje(),
            repo.getGraficoVendas(),
            repo.getTopProdutos(),
            repo.getTransacoesRecentes()
        ]);

        res.json({
            vendasHoje: parseFloat(vendasHoje),
            graficoVendas,
            graficoProdutos,
            transacoes
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro no dashboard" });
    }
}

module.exports = { getDashboardFull };