import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Package, ShoppingCart, DollarSign, 
  Bell, Search, ChevronDown, LogOut, 
  LayoutDashboard, FileText, Users, Settings 
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

// Importa o teu SCSS original
import s from './dashboard.module.scss';

export default function Dashboard() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // --- ESTADO DE DADOS (Conectado ao Banco) ---
  const [dashboardData, setDashboardData] = useState({
    vendasHoje: 0,
    graficoVendas: [],    // Ex: [{dia: '04/12', total: 150.00}]
    graficoProdutos: [],  // Ex: [{name: 'Pão', quantidade: 10}]
    transacoes: []        // Lista das últimas vendas
  });

  // --- LEITURA DO TOKEN ---
  const token = localStorage.getItem("authToken");
  let user = null;
  if (token) {
    try { user = jwtDecode(token); } catch (e) { console.error("Token inválido"); }
  }
  // Iniciais do Usuário (Ex: "PA" para Pâmela Alves)
  const initials = user?.username 
    ? user.username.split(" ").slice(0,2).map(n => n[0]).join("").toUpperCase() 
    : "US";

  // --- BUSCAR DADOS REAIS DO BACKEND ---
  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('http://localhost:3000/dashboard/full');
        const data = await res.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
      }
    }
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  return (
    <div className={s.layout}>
      
      {/* --- SIDEBAR (Igual ao original) --- */}
      <aside className={s.sidebar}>
        <div className={s.logoContainer}>
          <h1 className={s.logo}>PÃO DOURADO</h1>
        </div>
        <nav className={s.nav}>
          <a href="/dashboard" className={`${s.navItem} ${s.active}`}>
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </a>
          <a href="/vendas" className={s.navItem}>
            <ShoppingCart size={20} /> <span>Vendas</span>
          </a>
          <a href="/estoque" className={s.navItem}>
            <Package size={20} /> <span>Estoque</span>
          </a>
          <a href="/clientes" className={s.navItem}>
            <Users size={20} /> <span>Clientes</span>
          </a>
          <a href="/relatorios" className={s.navItem}>
            <FileText size={20} /> <span>Relatórios</span>
          </a>
        </nav>
        <div className={s.sidebarFooter}>
          <button onClick={handleLogout} className={s.logoutBtn}>
            <LogOut size={20} /> <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className={s.mainWrapper}>
        
        {/* TOPBAR */}
        <header className={s.topbar}>
          <div className={s.searchWrapper}>
            <Search className={s.searchIcon} size={20} />
            <input type="text" placeholder="Buscar..." className={s.searchInput} />
          </div>

          <div className={s.profileWrapper}>
            <button className={s.iconBtn}><Bell size={20} /></button>
            
            {/* Dropdown de Usuário */}
            <div 
              className={s.userProfile}
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{position: 'relative'}} // Ajuste inline para o dropdown funcionar
            >
              <div className={s.avatar}>{initials}</div>
              <span>{user?.username || "Visitante"}</span>
              <ChevronDown size={16} />

              {/* Menu Flutuante */}
              {showUserMenu && (
                <div style={{
                  position: 'absolute', top: '120%', right: 0,
                  background: 'white', border: '1px solid #e2e8f0',
                  borderRadius: '8px', padding: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  width: '160px', zIndex: 100
                }}>
                   <button onClick={handleLogout} style={{
                     display: 'flex', alignItems: 'center', gap: '8px',
                     width: '100%', padding: '8px', border: 'none',
                     background: 'transparent', cursor: 'pointer', color: '#ef4444'
                   }}>
                     <LogOut size={16}/> Sair
                   </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <main className={s.content}>
          <div className={s.pageHeader}>
            <div>
              <h2 className={s.title}>Dashboard</h2>
              <p className={s.subtitle}>Visão geral do negócio em tempo real</p>
            </div>
            {/* Botão decorativo */}
            <button className={s.primaryBtn} onClick={() => window.print()}>
              Imprimir Resumo
            </button>
          </div>

          {/* 1. GRIDS DE ESTATÍSTICAS (KPIs) */}
          <div className={s.statsGrid}>
            {/* Card 1: Vendas Hoje (Real do Banco) */}
            <StatCard 
              title="Vendas Hoje" 
              value={dashboardData.vendasHoje.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
              trend="Atualizado agora" 
              trendUp={true} 
              icon={DollarSign} 
              color="green" 
            />
            
            {/* Card 2: Produtos Populares (Conta do gráfico) */}
            <StatCard 
              title="Produtos Top" 
              value={dashboardData.graficoProdutos.length} 
              trend="Itens mais saídos" 
              trendUp={true} 
              icon={Package} 
              color="blue" 
            />
            
            {/* Card 3: Meta (Fictício para compor layout) */}
            <StatCard 
              title="Meta Mensal" 
              value="65%" 
              trend="Em progresso" 
              trendUp={true} 
              icon={TrendingUp} 
              color="orange" 
            />
          </div>

          {/* 2. GRÁFICOS (Charts) */}
          <div className={s.chartsGrid}>
            
            {/* Gráfico de Linha: Evolução de Vendas */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3>Evolução de Vendas</h3>
                <p>Últimos 7 dias</p>
              </div>
              <div className={s.chartContainer}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.graficoVendas}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="dia" stroke="#888" tick={{fontSize: 12}} />
                    <YAxis stroke="#888" tick={{fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}} />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#E88C22" 
                      strokeWidth={3} 
                      dot={{r: 4, fill: '#E88C22', strokeWidth: 2, stroke: '#fff'}}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráfico de Barras: Top Produtos */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3>Top Produtos</h3>
                <p>Mais vendidos</p>
              </div>
              <div className={s.chartContainer}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.graficoProdutos} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11}} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="quantidade" fill="#8B1C1C" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* 3. TABELA DE TRANSAÇÕES RECENTES */}
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3>Últimas Transações</h3>
              <p>Registo em tempo real do banco de dados</p>
            </div>
            <div className={s.tableResponsive}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Produto Principal</th>
                    <th>Valor Total</th>
                    <th>Data/Hora</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.transacoes.length > 0 ? (
                    dashboardData.transacoes.map((t) => (
                      <tr key={t.id}>
                        <td>#{t.id}</td>
                        <td className={s.productCell}>{t.produto}</td>
                        <td className={s.valueCell}>R$ {parseFloat(t.valor).toFixed(2)}</td>
                        <td className={s.dateCell}>{t.data}</td>
                        <td>
                          <span className={`${s.statusBadge} ${s.concluído}`}>Concluído</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" style={{textAlign:'center', padding:'20px', color:'#888'}}>Nenhuma venda hoje.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

// --- Componente Auxiliar: StatCard (Para manter o design limpo) ---
function StatCard({ title, value, trend, trendUp, icon: Icon, color }) {
  return (
    <div className={s.statCard}>
      <div className={s.statHeader}>
        <span className={s.statTitle}>{title}</span>
        <div className={`${s.iconWrapper} ${s[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className={s.statBody}>
        <span className={s.statValue}>{value}</span>
      </div>
      <div className={s.statFooter}>
        <span className={trendUp ? s.trendUp : s.trendDown}>
          {trendUp ? <TrendingUp size={14}/> : <TrendingUp size={14} style={{transform:'scaleY(-1)'}}/>} 
          {trend}
        </span>
      </div>
    </div>
  );
}