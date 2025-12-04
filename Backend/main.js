const express = require("express");
const cors = require("cors");

// Importações
const authRoutes = require("./routes/authRoutes");            
const colaboradorRoutes = require("./routes/colaboradorRoutes");
const produtoRoutes = require("./routes/produtoRoutes");  
const fornecedorRoutes = require("./routes/fornecedorRoutes");
const estoqueRoutes = require("./routes/estoqueRoutes");
const vendaRoutes = require("./routes/vendaRoutes"); // NOVO

const app = express();
const PORT = 3000;

app.use(cors({ origin: "*" })); 
app.use(express.json());       

// Rotas
app.get('/', (req, res) => res.send('API Online!'));

app.use("/", authRoutes);                       
app.use("/colaboradores", colaboradorRoutes);
app.use("/produtos", produtoRoutes);    
app.use("/fornecedores", fornecedorRoutes);
app.use("/estoque", estoqueRoutes);
app.use("/vendas", vendaRoutes); // NOVO: http://localhost:3000/vendas

app.listen(PORT, () => {
    console.log(`✅ Backend rodando na porta ${PORT}`);
    // ... logs das outras rotas
    console.log(`   ➜ Vendas: http://localhost:${PORT}/vendas`);
});