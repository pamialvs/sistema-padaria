const repo = require('../repositories/vendaRepository');

async function registrarVenda(req, res) {
    const dados = req.body;

    // O Front-end deve enviar: { idColaborador, valorTotal, pagamento, produtos: [1, 2] }
    if (!dados.idColaborador || !dados.produtos || dados.produtos.length === 0) {
        return res.status(400).json({ erro: "Venda deve ter colaborador e pelo menos 1 produto." });
    }

    try {
        // 1. Cria a Venda
        const vendaCriada = await repo.createVenda({
            valorTotal: dados.valorTotal,
            data: new Date(), // Data atual do servidor
            pagamento: dados.pagamento,
            quantidadeTotal: dados.produtos.length, // Quantidade baseada na lista enviada
            idColaborador: dados.idColaborador
        });

        const idGerado = vendaCriada.idvenda;

        // 2. Insere cada produto na tabela associativa ItensVenda
        // Usamos um loop para processar a lista de IDs de produtos
        for (const idProduto of dados.produtos) {
            await repo.addItemVenda(idGerado, idProduto);
        }

        res.status(201).json({ mensagem: "Venda registrada com sucesso!", idVenda: idGerado });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao processar venda." });
    }
}

async function listar(req, res) {
    try {
        const lista = await repo.getAllVendas();
        res.status(200).json(lista);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

module.exports = { registrarVenda, listar };