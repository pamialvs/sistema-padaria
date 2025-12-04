import Login from './Pages/login/Login.jsx';
import Cadastro from './Pages/cadastro/Cadastro.jsx'; 
import Dashboard from './Pages/dashboard/Dashboard.jsx';
import Vendas from './Pages/vendas/Vendas.jsx';
import  Estoque from './Pages/estoque/Estoque.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    
    <BrowserRouter >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
         <Route path="/vendas" element={<Vendas />} /> 
          <Route path="/estoque" element={<Estoque />} /> 

      </Routes>
    </BrowserRouter>
  );
}

// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// // Importação das Páginas
// import Login from './Pages/login/Login.jsx';
// import Cadastro from './Pages/cadastro/Cadastro.jsx'; 
// import Dashboard from './Pages/dashboard/Dashboard.jsx';

// // Componente simples para proteger a rota do Dashboard
// // Se não tiver token no localStorage, manda de volta para o Login ("/")
// const RotaProtegida = ({ children }) => {
//   const token = localStorage.getItem('authToken');
//   return token ? children : <Navigate to="/" />;
// };

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Rota Principal (Login) */}
//         <Route path="/" element={<Login />} />

//         {/* Rota de Cadastro */}
//         <Route path="/cadastro" element={<Cadastro />} />

//         {/* Rota do Dashboard (Protegida) */}
//         <Route 
//           path="/dashboard" 
//           element={
//             <RotaProtegida>
//               <Dashboard />
//             </RotaProtegida>
//           } 
//         />
        
//         {/* Rota para qualquer endereço errado (404) -> manda pro Login */}
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }