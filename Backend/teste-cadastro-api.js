// Arquivo: Backend/teste-cadastro-api.js
async function cadastrarViaAPI() {
    console.log("📡 Enviando dados para http://localhost:3000/colaboradores...");

    const dadosDoFront = {
        nome: "Pâmela Alves",
        cargo: "Gerente",
        dataInicio: "2025-02-01",
        experiencia: "Pleno",
        salario: 4200.00,
        funcao: "Administração",
        status: 1
    };

    try {
        const resposta = await fetch('http://localhost:3000/colaboradores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosDoFront)
        });

        const json = await resposta.json();
        
        if (resposta.status === 201) {
            console.log("✅ SUCESSO! Código 201 (Created)");
            console.log("Dados salvos:", json);
        } else {
            console.log("❌ ERRO:", resposta.status, json);
        }
    } catch (erro) {
        console.error("Falha na conexão:", erro.cause || erro.message);
    }
}

cadastrarViaAPI();