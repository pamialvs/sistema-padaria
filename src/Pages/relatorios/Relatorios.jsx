import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, FileText, Users, LogOut, Printer } from "lucide-react";
import s from '../vendas/vendas.module.scss'; // Reutilizando estilo!

export default function Relatorios() {
  const navigate = useNavigate();
  const [dados, setDados] = useState([]);

  useEffect(() => {
    // Reutiliza a rota de listagem de vendas que já criaste
    fetch("http://localhost:3000/vendas")
        .then(res => res.json())
        .then(data => setDados(data))
        .catch(console.error);
  }, []);

  const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/'); };

  return (
    <div className={s.layout}>
      <aside className={s.sidebar}>
        <div className={s.logoContainer}><h1 className={s.logo}>PÃO DOURADO</h1></div>
        <nav className={s.nav}>
          <a href="/dashboard" className={s.navItem}><LayoutDashboard size={20}/> <span>Dashboard</span></a>
          <a href="/vendas" className={s.navItem}><ShoppingCart size={20}/> <span>Vendas</span></a>
          <a href="/estoque" className={s.navItem}><Package size={20}/> <span>Estoque</span></a>
          <a href="/clientes" className={s.navItem}><Users size={20}/> <span>Clientes</span></a>
          <a href="#" className={`${s.navItem} ${s.active}`}><FileText size={20}/> <span>Relatórios</span></a>
        </nav>
        <div className={s.sidebarFooter}><button onClick={handleLogout} className={s.logoutBtn}><LogOut size={20}/> <span>Sair</span></button></div>
      </aside>

      <main className={s.content}>
        <header className={s.pageHeader}>
          <div><h2 className={s.title}>Relatórios Gerenciais</h2><p className={s.subtitle}>Auditoria de Vendas</p></div>
          <button className={s.btnAdd} onClick={() => window.print()}><Printer size={18} /> Imprimir</button>
        </header>

        <div className={s.tableCard}>
          <table className={s.table}>
            <thead><tr><th>ID</th><th>Data</th><th>Produto</th><th>Vendedor</th><th>Valor</th></tr></thead>
            <tbody>
              {dados.map((d) => (
                <tr key={d.idvenda}>
                  <td>#{d.idvenda}</td>
                  <td>{new Date(d.datavenda).toLocaleDateString()}</td>
                  <td>{d.nomeproduto}</td>
                  <td>{d.nomecolaborador}</td>
                  <td style={{fontWeight:'bold', color:'#8B1C1C'}}>R$ {parseFloat(d.valorunivenda).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}