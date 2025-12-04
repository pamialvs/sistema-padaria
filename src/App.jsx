import Login from './Pages/login/Login.jsx';
import Cadastro from './Pages/cadastro/Cadastro.jsx'; 
import Dashboard from './Pages/dashboard/Dashboard.jsx';
import Vendas from './Pages/vendas/Vendas.jsx';
import Estoque from './Pages/estoque/Estoque.jsx';
import Clientes from './Pages/clientes/Clientes.jsx';
import Relatorios from './Pages/relatorios/Relatorios.jsx'; 

import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/vendas" element={<Vendas />} /> 
        <Route path="/estoque" element={<Estoque />} /> 
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/relatorios" element={<Relatorios />} />
      </Routes>
    </BrowserRouter>
  );
}