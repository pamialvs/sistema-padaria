// Arquivo: Backend/teste-api.js
// Esse script simula o que o Front-end fará
async function testeAPI() {
    console.log("Enviando requisição para a API...");

    const response = await fetch('http://localhost:3000/colaboradores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome: "Joana Dark",
            cargo: "Gerente",
            dataInicio: "2025-01-01",
            experiencia: "Master",
            salario: 5000.00,
            funcao: "Administração",
            status: 1
        })
    });

    const dados = await response.json();
    console.log("Resposta do Servidor:", response.status);
    console.log("Dados recebidos:", dados);
}

testeAPI();