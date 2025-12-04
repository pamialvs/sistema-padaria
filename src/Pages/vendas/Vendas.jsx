import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, Calendar, DollarSign, User, Search, Filter, 
  Plus, Eye, Trash2, X, LayoutDashboard, ShoppingCart, 
  LogOut, FileText, Users 
} from "lucide-react";
import s from '../vendas/vendas.module.scss';

// --- DADOS MOCKADOS ---
const produtosMock = [
  { id: 1, nome: "Pão Francês", preco: 0.50 },
  { id: 2, nome: "Pão de Forma", preco: 8.90 },
  { id: 3, nome: "Croissant", preco: 6.50 },
  { id: 4, nome: "Bolo de Chocolate", preco: 35.00 },
  { id: 5, nome: "Sonho", preco: 4.50 },
];

const vendasMock = [
  {
    id: 1, data: "2024-01-15", cliente: "João Silva",
    itens: [{ produto: "Pão Francês", quantidade: 10, preco: 0.50 }, { produto: "Croissant", quantidade: 2, preco: 6.50 }],
    total: 18.00, status: "Concluída", pagamento: "Dinheiro"
  },
  {
    id: 2, data: "2024-01-15", cliente: "Maria Santos",
    itens: [{ produto: "Bolo de Chocolate", quantidade: 1, preco: 35.00 }, { produto: "Pão de Forma", quantidade: 2, preco: 8.90 }],
    total: 52.80, status: "Concluída", pagamento: "Cartão"
  },
  {
    id: 3, data: "2024-01-14", cliente: "Carlos Oliveira",
    itens: [{ produto: "Sonho", quantidade: 5, preco: 4.50 }, { produto: "Pão Francês", quantidade: 15, preco: 0.50 }],
    total: 30.00, status: "Concluída", pagamento: "PIX"
  },
];

export default function GerenciarVendas() {
  const navigate = useNavigate();
  const [vendas, setVendas] = useState(vendasMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todas");
  
  // Modais
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detalhesVenda, setDetalhesVenda] = useState(null);

  // Estado do Formulário Nova Venda
  const [novaVenda, setNovaVenda] = useState({
    cliente: "",
    pagamento: "Dinheiro",
    itens: [{ produtoId: "", quantidade: 1 }]
  });

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  // --- LÓGICA DO FORMULÁRIO ---
  const handleAddItem = () => {
    setNovaVenda({ ...novaVenda, itens: [...novaVenda.itens, { produtoId: "", quantidade: 1 }] });
  };

  const handleRemoveItem = (index) => {
    const novosItens = novaVenda.itens.filter((_, i) => i !== index);
    setNovaVenda({ ...novaVenda, itens: novosItens });
  };

  const handleItemChange = (index, field, value) => {
    const novosItens = [...novaVenda.itens];
    novosItens[index][field] = value;
    setNovaVenda({ ...novaVenda, itens: novosItens });
  };

  const calcularTotalNovaVenda = () => {
    return novaVenda.itens.reduce((total, item) => {
      const produto = produtosMock.find(p => p.id === parseInt(item.produtoId));
      return total + (produto ? produto.preco * item.quantidade : 0);
    }, 0);
  };

  const handleSubmitVenda = (e) => {
    e.preventDefault();
    
    const itensVenda = novaVenda.itens.map(item => {
      const produto = produtosMock.find(p => p.id === parseInt(item.produtoId));
      if (!produto) return null;
      return { produto: produto.nome, quantidade: item.quantidade, preco: produto.preco };
    }).filter(Boolean); // Remove nulos

    if (itensVenda.length === 0) return alert("Adicione pelo menos um produto válido.");

    const vendaCriada = {
      id: vendas.length + 1,
      data: new Date().toISOString().split('T')[0],
      cliente: novaVenda.cliente,
      itens: itensVenda,
      total: calcularTotalNovaVenda(),
      status: "Concluída",
      pagamento: novaVenda.pagamento
    };

    setVendas([vendaCriada, ...vendas]);
    setNovaVenda({ cliente: "", pagamento: "Dinheiro", itens: [{ produtoId: "", quantidade: 1 }] });
    setIsAddModalOpen(false);
    alert("Venda registrada com sucesso!");
  };

  // --- FILTROS ---
  const vendasFiltradas = vendas.filter(venda => {
    const matchSearch = venda.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filtroStatus === "todas" || venda.status === filtroStatus;
    return matchSearch && matchStatus;
  });

  const totalVendas = vendasFiltradas.reduce((acc, venda) => acc + venda.total, 0);

  return (
    <div className={s.layout}>
      
      {/* SIDEBAR */}
      <aside className={s.sidebar}>
        <div className={s.logoContainer}><h1 className={s.logo}>PÃO DOURADO</h1></div>
        <nav className={s.nav}>
          <a href="/dashboard" className={s.navItem}><LayoutDashboard size={20}/> <span>Dashboard</span></a>
          <a href="/vendas" className={`${s.navItem} ${s.active}`}><ShoppingCart size={20}/> <span>Vendas</span></a>
          <a href="/estoque" className={s.navItem}><Package size={20}/> <span>Estoque</span></a>
          <a href="/clientes" className={s.navItem}><Users size={20}/> <span>Clientes</span></a>
          <a href="#" className={s.navItem}><FileText size={20}/> <span>Relatórios</span></a>
        </nav>
        <div className={s.sidebarFooter}>
          <button onClick={handleLogout} className={s.logoutBtn}><LogOut size={20}/> <span>Sair</span></button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className={s.content}>
        <header className={s.pageHeader}>
          <div>
            <h2 className={s.title}>Gerenciar Vendas</h2>
            <p className={s.subtitle}>Histórico e registro manual</p>
          </div>
          <button className={s.btnAdd} onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} /> Nova Venda
          </button>
        </header>

        {/* STAT CARDS */}
        <div className={s.statsGrid}>
          <div className={s.statCard}>
            <div className={s.statInfo}>
              <span>Total em Vendas</span>
              <strong>R$ {totalVendas.toFixed(2)}</strong>
            </div>
            <div className={`${s.iconWrapper} ${s.green}`}><DollarSign size={24} /></div>
          </div>
          <div className={s.statCard}>
            <div className={s.statInfo}>
              <span>Vendas Listadas</span>
              <strong>{vendasFiltradas.length}</strong>
            </div>
            <div className={`${s.iconWrapper} ${s.orange}`}><Package size={24} /></div>
          </div>
        </div>

        {/* FILTROS E TABELA */}
        <div className={s.tableCard}>
          <div className={s.filters}>
            <div className={s.searchBox}>
              <Search className={s.searchIcon} size={18} />
              <input 
                type="text" 
                placeholder="Buscar por cliente..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className={s.selectFilter} 
              value={filtroStatus} 
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="todas">Todas</option>
              <option value="Concluída">Concluídas</option>
              <option value="Pendente">Pendentes</option>
            </select>
          </div>

          <div className={s.tableResponsive}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Cliente</th>
                  <th>Itens</th>
                  <th>Total</th>
                  <th>Pagamento</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {vendasFiltradas.map((venda) => (
                  <tr key={venda.id}>
                    <td>{new Date(venda.data).toLocaleDateString('pt-BR')}</td>
                    <td className={s.clientName}>{venda.cliente}</td>
                    <td>{venda.itens.length} itens</td>
                    <td className={s.totalValue}>R$ {venda.total.toFixed(2)}</td>
                    <td><span className={s.badge}>{venda.pagamento}</span></td>
                    <td>
                      <span className={`${s.statusBadge} ${s[venda.status.toLowerCase()]}`}>
                        {venda.status}
                      </span>
                    </td>
                    <td>
                      <button className={s.actionBtn} onClick={() => setDetalhesVenda(venda)}>
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- MODAL DE DETALHES --- */}
      {detalhesVenda && (
        <div className={s.modalOverlay}>
          <div className={s.modal}>
            <div className={s.modalHeader}>
              <h3>Detalhes da Venda #{detalhesVenda.id}</h3>
              <button onClick={() => setDetalhesVenda(null)}><X size={20}/></button>
            </div>
            <div className={s.modalBody}>
              <p><strong>Cliente:</strong> {detalhesVenda.cliente}</p>
              <p><strong>Data:</strong> {new Date(detalhesVenda.data).toLocaleDateString('pt-BR')}</p>
              <p><strong>Pagamento:</strong> {detalhesVenda.pagamento}</p>
              <div className={s.divider}></div>
              <h4>Produtos</h4>
              <ul className={s.productList}>
                {detalhesVenda.itens.map((item, idx) => (
                  <li key={idx}>
                    <span>{item.produto} (x{item.quantidade})</span>
                    <span>R$ {(item.quantidade * item.preco).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className={s.modalTotal}>
                <span>Total</span>
                <span>R$ {detalhesVenda.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DE NOVA VENDA --- */}
      {isAddModalOpen && (
        <div className={s.modalOverlay}>
          <div className={`${s.modal} ${s.modalLarge}`}>
            <div className={s.modalHeader}>
              <h3>Registrar Nova Venda</h3>
              <button onClick={() => setIsAddModalOpen(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmitVenda} className={s.form}>
              <div className={s.formRow}>
                <div className={s.formGroup}>
                  <label>Cliente</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Nome do Cliente"
                    value={novaVenda.cliente}
                    onChange={(e) => setNovaVenda({...novaVenda, cliente: e.target.value})}
                  />
                </div>
                <div className={s.formGroup}>
                  <label>Pagamento</label>
                  <select 
                    value={novaVenda.pagamento}
                    onChange={(e) => setNovaVenda({...novaVenda, pagamento: e.target.value})}
                  >
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Cartão">Cartão</option>
                    <option value="PIX">PIX</option>
                  </select>
                </div>
              </div>

              <div className={s.itemsSection}>
                <div className={s.itemsHeader}>
                  <label>Produtos</label>
                  <button type="button" onClick={handleAddItem} className={s.btnSmall}>
                    <Plus size={14}/> Add
                  </button>
                </div>
                {novaVenda.itens.map((item, index) => (
                  <div key={index} className={s.itemRow}>
                    <select 
                      required
                      value={item.produtoId}
                      onChange={(e) => handleItemChange(index, 'produtoId', e.target.value)}
                    >
                      <option value="">Selecione...</option>
                      {produtosMock.map(p => (
                        <option key={p.id} value={p.id}>{p.nome} (R$ {p.preco.toFixed(2)})</option>
                      ))}
                    </select>
                    <input 
                      type="number" 
                      min="1" 
                      required
                      value={item.quantidade}
                      onChange={(e) => handleItemChange(index, 'quantidade', parseInt(e.target.value))}
                      style={{width: '80px'}}
                    />
                    {novaVenda.itens.length > 1 && (
                      <button type="button" className={s.btnDelete} onClick={() => handleRemoveItem(index)}>
                        <Trash2 size={16}/>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className={s.modalFooter}>
                <div className={s.totalPreview}>
                  Total: R$ {calcularTotalNovaVenda().toFixed(2)}
                </div>
                <button type="submit" className={s.btnSubmit}>Confirmar Venda</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}