// Arquivo: Backend/teste-insert.js
const repo = require('./repositories/colaboradorRepository');

async function executarTeste() {
    console.log("Iniciando cadastro de teste...");

    const novoFuncionario = {
        nome: "Teste da Silva",
        cargo: "Atendente",
        dataInicio: "2025-12-03", // Formato ISO YYYY-MM-DD [cite: 56]
        experiencia: "Júnior",
        salario: 1412.00,
        funcao: "Vendas",
        status: 1
    };

    try {
        const resultado = await repo.createColaborador(novoFuncionario);
        console.log("✅ SUCESSO! Colaborador inserido.");
        console.log("ID Gerado pelo Banco:", resultado.idcolaborador);
    } catch (erro) {
        console.error("❌ FALHA:", erro.message);
    }
}

executarTeste();