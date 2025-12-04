const repo = require('../repositories/vendaRepository');

async function registrarVenda(req, res) {
    const dados = req.body;

    
    if (!dados.idColaborador || !dados.produtos || dados.produtos.length === 0) {
        return res.status(400).json({ erro: "Venda deve ter colaborador e pelo menos 1 produto." });
    }

    try {
     
        const vendaCriada = await repo.createVenda({
            valorTotal: dados.valorTotal,
            data: new Date(), 
            pagamento: dados.pagamento,
            quantidadeTotal: dados.produtos.length,
            idColaborador: dados.idColaborador
        });

        const idGerado = vendaCriada.idvenda;

      
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