import Login from './Pages/login/Login.jsx';
import Cadastro from './Pages/cadastro/Cadastro.jsx'; 
import Dashboard from './Pages/dashboard/Dashboard.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        {/* //essa rota foi adicionda para eu poder entrar na pagina sem a logica do login */}
      </Routes>
    </BrowserRouter>
  );
}