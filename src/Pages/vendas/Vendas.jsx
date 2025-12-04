import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Importação necessária para ler o ID do usuário
import { 
  Package, Calendar, DollarSign, User, Search, Filter, 
  Plus, Eye, Trash2, X, LayoutDashboard, ShoppingCart, 
  LogOut, FileText, Users 
} from "lucide-react";
import s from '../vendas/vendas.module.scss';

export default function GerenciarVendas() {
  const navigate = useNavigate();
  
  // Estados de Dados
  const [vendas, setVendas] = useState([]); // Inicia vazio, será preenchido pela API (se quiser listar histórico) ou manter mock
  const [produtos, setProdutos] = useState([]); // Produtos vindos da API
  
  // Estados de Filtro e UI
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todas");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detalhesVenda, setDetalhesVenda] = useState(null);

  // Estado do Formulário Nova Venda
  const [novaVenda, setNovaVenda] = useState({
    cliente: "",
    pagamento: "Dinheiro",
    itens: [{ produtoId: "", quantidade: 1 }]
  });

  // --- 1. BUSCAR PRODUTOS DO BACKEND AO CARREGAR ---
  useEffect(() => {
    async function fetchProdutos() {
      try {
        const response = await fetch("http://localhost:3000/produtos");
        const data = await response.json();
        
        // ADAPTAÇÃO PARA A POC:
        // O banco não tem preço de venda no Produto, então geramos um fictício
        // para que o cálculo de total funcione na tela.
        const produtosComPreco = data.map(p => ({
          ...p,
          // O Postgres retorna tudo em minúsculo (idproduto, nomeproduto)
          id: p.idproduto, 
          nome: p.nomeproduto,
          preco: (Math.random() * (20 - 5) + 5) // Preço aleatório entre 5 e 20
        }));
        
        setProdutos(produtosComPreco);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        alert("Erro ao conectar com o servidor.");
      }
    }
    fetchProdutos();
  }, []);

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
      // Busca no estado 'produtos' que carregamos da API
      const produto = produtos.find(p => p.id === parseInt(item.produtoId));
      return total + (produto ? produto.preco * item.quantidade : 0);
    }, 0);
  };

  // --- 2. ENVIAR VENDA PARA O BACKEND ---
  const handleSubmitVenda = async (e) => {
    e.preventDefault();
    
    // Obter Token e ID do Colaborador
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert("Sessão expirada. Faça login novamente.");
        return navigate('/');
    }
    
    let user;
    try {
        user = jwtDecode(token);
    } catch (err) {
        console.error("Erro token:", err);
        return;
    }

    // Preparar lista de IDs "flat" para o Backend
    // Exemplo: {id: 1, qtd: 2} vira [1, 1] no array
    const listaIdsProdutos = [];
    novaVenda.itens.forEach(item => {
        for (let i = 0; i < item.quantidade; i++) {
            listaIdsProdutos.push(parseInt(item.produtoId));
        }
    });

    if (listaIdsProdutos.length === 0) return alert("Adicione produtos à venda.");

    const payload = {
        idColaborador: user.id, // ID vindo do Token JWT
        valorTotal: calcularTotalNovaVenda(),
        pagamento: novaVenda.pagamento,
        produtos: listaIdsProdutos
    };

    try {
        const response = await fetch("http://localhost:3000/vendas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const result = await response.json();
            alert(`Venda #${result.idVenda} registrada com sucesso!`);
            
            // Adiciona visualmente à lista (para não precisar recarregar tudo agora)
            const vendaVisual = {
                id: result.idVenda || Date.now(),
                data: new Date().toISOString(),
                cliente: novaVenda.cliente,
                itens: novaVenda.itens.map(i => {
                    const p = produtos.find(prod => prod.id === parseInt(i.produtoId));
                    return { produto: p?.nome, quantidade: i.quantidade, preco: p?.preco };
                }),
                total: payload.valorTotal,
                status: "Concluída",
                pagamento: novaVenda.pagamento
            };
            
            setVendas([vendaVisual, ...vendas]);
            setNovaVenda({ cliente: "", pagamento: "Dinheiro", itens: [{ produtoId: "", quantidade: 1 }] });
            setIsAddModalOpen(false);
        } else {
            const erro = await response.json();
            alert("Erro: " + erro.erro);
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao salvar venda.");
    }
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
          <a href="#" className={`${s.navItem} ${s.active}`}><ShoppingCart size={20}/> <span>Vendas</span></a>
          <a href="/estoque" className={s.navItem}><Package size={20}/> <span>Estoque</span></a>
          <a href="#" className={s.navItem}><Users size={20}/> <span>Clientes</span></a>
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
                {vendasFiltradas.length > 0 ? (
                    vendasFiltradas.map((venda) => (
                    <tr key={venda.id}>
                        <td>{new Date(venda.data).toLocaleDateString('pt-BR')}</td>
                        <td className={s.clientName}>{venda.cliente}</td>
                        <td>{venda.itens.length} itens</td>
                        <td className={s.totalValue}>R$ {parseFloat(venda.total).toFixed(2)}</td>
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
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" style={{textAlign: "center", padding: "2rem", color: "#888"}}>
                            Nenhuma venda registrada ainda. Clique em "Nova Venda".
                        </td>
                    </tr>
                )}
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
                    <span>R$ {(item.quantidade * (item.preco || 0)).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className={s.modalTotal}>
                <span>Total</span>
                <span>R$ {parseFloat(detalhesVenda.total).toFixed(2)}</span>
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
                  <label>Produtos (Carregados do Banco)</label>
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
                      {produtos.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.nome} (Est. R$ {p.preco.toFixed(2)})
                        </option>
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