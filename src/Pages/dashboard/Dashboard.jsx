import React from 'react'; 
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Menu, 
  Bell, 
  Search, 
  ChevronDown,
  LogOut,
  LayoutDashboard,
  FileText,
  Users
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import s from './dashboard.module.scss';

// --- DADOS MOCKADOS (Do seu código) ---
const salesData = [
  { name: "Seg", vendas: 4200 },
  { name: "Ter", vendas: 3800 },
  { name: "Qua", vendas: 5100 },
  { name: "Qui", vendas: 4600 },
  { name: "Sex", vendas: 6200 },
  { name: "Sáb", vendas: 8100 },
  { name: "Dom", vendas: 7200 },
];

const productsData = [
  { name: "Pão Francês", quantidade: 450 },
  { name: "Pão Forma", quantidade: 320 },
  { name: "Croissant", quantidade: 280 },
  { name: "Bolo Choc.", quantidade: 190 },
  { name: "Sonho", quantidade: 150 },
];

const recentTransactions = [
  { id: 1, produto: "Pão Francês", quantidade: 10, valor: "R$ 35,00", data: "24/11/2025 09:30", status: "Concluído" },
  { id: 2, produto: "Croissant", quantidade: 5, valor: "R$ 25,00", data: "24/11/2025 10:15", status: "Pendente" },
  { id: 3, produto: "Bolo de Chocolate", quantidade: 1, valor: "R$ 45,00", data: "24/11/2025 11:00", status: "Concluído" },
  { id: 4, produto: "Pão de Forma", quantidade: 3, valor: "R$ 21,00", data: "24/11/2025 11:45", status: "Concluído" },
  { id: 5, produto: "Sonho", quantidade: 8, valor: "R$ 32,00", data: "24/11/2025 12:20", status: "Cancelado" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className={s.layout}>
      
      {/* --- SIDEBAR --- */}
      <aside className={s.sidebar}>
        <div className={s.logoContainer}>
          <h1 className={s.logo}>PÃO DOURADO</h1>
        </div>
        
        <nav className={s.nav}>
          <a href="#" className={`${s.navItem} ${s.active}`}>
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </a>
          <a href="vendas" className={s.navItem}>
            <ShoppingCart size={20} /> <span>Vendas</span>
          </a>
          <a href="#" className={s.navItem}>
            <Package size={20} /> <span>Estoque</span>
          </a>
          <a href="#" className={s.navItem}>
            <Users size={20} /> <span>Clientes</span>
          </a>
          <a href="#" className={s.navItem}>
            <FileText size={20} /> <span>Relatórios</span>
          </a>
        </nav>

        <div className={s.sidebarFooter}>
          <button onClick={handleLogout} className={s.logoutBtn}>
            <LogOut size={20} /> <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className={s.mainWrapper}>
        
        {/* Topbar */}
        

        {/* Dashboard Content */}
        <main className={s.content}>
          <div className={s.pageHeader}>
            <div>
              <h2 className={s.title}>Dashboard</h2>
              <p className={s.subtitle}>Visão geral do seu negócio</p>
            </div>
            <button className={s.primaryBtn}>Download Relatório</button>
          </div>

          {/* STATS GRID */}
          <div className={s.statsGrid}>
            <StatCard 
              title="Vendas do Dia" 
              value="R$ 1.247,50" 
              trend="+12%" 
              trendUp={true} 
              icon={DollarSign} 
              color="orange"
            />
            <StatCard 
              title="Produtos Vendidos" 
              value="342" 
              trend="+8%" 
              trendUp={true} 
              icon={ShoppingCart} 
              color="blue"
            />
            <StatCard 
              title="Estoque Total" 
              value="1.234" 
              trend="-5%" 
              trendUp={false} 
              icon={Package} 
              color="red"
            />
            <StatCard 
              title="Crescimento" 
              value="+23%" 
              trend="Melhor mês" 
              trendUp={true} 
              icon={TrendingUp} 
              color="green"
            />
          </div>

          {/* CHARTS GRID */}
          <div className={s.chartsGrid}>
            {/* Gráfico de Linha (Vendas) */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3>Vendas da Semana</h3>
                <p>Evolução dos últimos 7 dias</p>
              </div>
              <div className={s.chartContainer}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#888" tick={{fontSize: 12}} />
                    <YAxis stroke="#888" tick={{fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="vendas" 
                      stroke="#E88C22" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#E88C22', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráfico de Barras (Produtos) */}
            <div className={s.card}>
              <div className={s.cardHeader}>
                <h3>Top Produtos</h3>
                <p>Mais vendidos na semana</p>
              </div>
              <div className={s.chartContainer}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#888" tick={{fontSize: 11}} />
                    <Tooltip 
                       cursor={{fill: '#f4f4f4'}}
                       contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar 
                      dataKey="quantidade" 
                      fill="#8B1C1C" 
                      radius={[4, 4, 0, 0]} 
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* TRANSACTIONS TABLE */}
          <div className={s.card}>
            <div className={s.cardHeader}>
              <h3>Transações Recentes</h3>
              <p>Últimas vendas realizadas hoje</p>
            </div>
            <div className={s.tableResponsive}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Qtd.</th>
                    <th>Valor</th>
                    <th>Data/Hora</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((t) => (
                    <tr key={t.id}>
                      <td className={s.productCell}>{t.produto}</td>
                      <td>{t.quantidade}</td>
                      <td className={s.valueCell}>{t.valor}</td>
                      <td className={s.dateCell}>{t.data}</td>
                      <td>
                        <span className={`${s.statusBadge} ${s[t.status.toLowerCase()]}`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

// Componente Interno Simples para os Cards de Estatística
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
          {trendUp ? <TrendingUp size={14} /> : <TrendingUp size={14} style={{transform: 'scaleY(-1)'}} />}
          {trend}
        </span>
        <span className={s.statLabel}>vs. período anterior</span>
      </div>
    </div>
  );
}