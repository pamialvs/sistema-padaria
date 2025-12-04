import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { 
  Package, DollarSign, Search, Filter, 
  Plus, Eye, Trash2, X, LayoutDashboard, ShoppingCart, 
  LogOut, FileText, Users 
} from "lucide-react";
import s from '../vendas/vendas.module.scss';

export default function GerenciarVendas() {
  const navigate = useNavigate();
  
  // Estados de Dados
  const [vendas, setVendas] = useState([]); 
  const [produtos, setProdutos] = useState([]); 
  
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

  // --- 1. CARREGAR PRODUTOS (Para o Dropdown) ---
  useEffect(() => {
    async function fetchProdutos() {
      try {
        const response = await fetch("http://localhost:3000/produtos");
        const data = await response.json();
        
        // Simula preço pois o banco não tem tabela de preço de venda fixa
        const produtosComPreco = data.map(p => ({
          ...p,
          id: p.idproduto, 
          nome: p.nomeproduto,
          preco: (Math.random() * (20 - 5) + 5) 
        }));
        
        setProdutos(produtosComPreco);
      } catch (error) {
        console.error("Erro produtos:", error);
      }
    }
    fetchProdutos();
  }, []);

  // --- 2. CARREGAR HISTÓRICO DE VENDAS (A CORREÇÃO ESTÁ AQUI) ---
  useEffect(() => {
    async function fetchVendas() {
        try {
            const response = await fetch("http://localhost:3000/vendas");
            const dadosBrutos = await response.json();

            // O Postgres devolve uma linha por item vendido.
            // Precisamos AGRUPAR isso por ID da venda para mostrar na tabela.
            const vendasAgrupadas = {};

            dadosBrutos.forEach(linha => {
                if (!vendasAgrupadas[linha.idvenda]) {
                    vendasAgrupadas[linha.idvenda] = {
                        id: linha.idvenda,
                        data: linha.datavenda,
                        cliente: linha.nomecolaborador || "Cliente Balcão", // O Backend retorna o nome do funcionário
                        total: parseFloat(linha.valorunivenda), // No teu banco, o total está nesta coluna
                        pagamento: "Dinheiro", // O select atual não traz pgto, assumimos Dinheiro
                        status: "Concluída",
                        itens: []
                    };
                }
                // Adiciona o produto à lista de itens dessa venda
                vendasAgrupadas[linha.idvenda].itens.push({
                    produto: linha.nomeproduto,
                    quantidade: 1, // O select não traz a qtd do item individual, assumimos 1 para visualização
                    preco: 0 
                });
            });

            // Converte o objeto de volta para array
            setVendas(Object.values(vendasAgrupadas));

        } catch (error) {
            console.error("Erro vendas:", error);
        }
    }
    fetchVendas();
  }, []); // Roda apenas uma vez ao abrir a página

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
      const produto = produtos.find(p => p.id === parseInt(item.produtoId));
      return total + (produto ? produto.preco * item.quantidade : 0);
    }, 0);
  };

  // --- ENVIAR NOVA VENDA ---
  const handleSubmitVenda = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('authToken');
    if (!token) return navigate('/');
    
    let user;
    try { user = jwtDecode(token); } catch (err) { return; }

    const listaIdsProdutos = [];
    novaVenda.itens.forEach(item => {
        for (let i = 0; i < item.quantidade; i++) {
            listaIdsProdutos.push(parseInt(item.produtoId));
        }
    });

    if (listaIdsProdutos.length === 0) return alert("Adicione produtos.");

    const payload = {
        idColaborador: user.id,
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
            alert(`Venda #${result.idVenda} registrada!`);
            window.location.reload(); // Recarrega para buscar do banco atualizado
        } else {
            alert("Erro ao salvar.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão.");
    }
  };

  // --- FILTROS ---
  const vendasFiltradas = vendas.filter(venda => {
    const termo = searchTerm.toLowerCase();
    // Proteção caso cliente seja null
    const cliente = venda.cliente ? venda.cliente.toLowerCase() : "";
    const matchSearch = cliente.includes(termo);
    const matchStatus = filtroStatus === "todas" || venda.status === filtroStatus;
    return matchSearch && matchStatus;
  });

  const totalVendas = vendasFiltradas.reduce((acc, venda) => acc + (venda.total || 0), 0);

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
              <strong>{totalVendas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
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

        {/* TABELA */}
        <div className={s.tableCard}>
          <div className={s.filters}>
            <div className={s.searchBox}>
              <Search className={s.searchIcon} size={18} />
              <input 
                type="text" 
                placeholder="Buscar..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select className={s.selectFilter} value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
              <option value="todas">Todas</option>
              <option value="Concluída">Concluídas</option>
            </select>
          </div>

          <div className={s.tableResponsive}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Cliente/Colab.</th>
                  <th>Itens</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {vendasFiltradas.length > 0 ? (
                    vendasFiltradas.map((venda) => (
                    <tr key={venda.id}>
                        <td>{venda.data ? new Date(venda.data).toLocaleDateString('pt-BR') : '-'}</td>
                        <td className={s.clientName}>{venda.cliente}</td>
                        <td>{venda.itens.length} itens</td>
                        <td className={s.totalValue}>
                            {venda.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td>
                        <span className={`${s.statusBadge} ${s[venda.status ? venda.status.toLowerCase() : 'concluída']}`}>
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
                            Nenhuma venda encontrada no histórico.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- MODAIS (DETALHES E NOVA VENDA) --- */}
      {/* (Mantive os modais iguais ao código anterior, pois funcionam bem) */}
      
      {detalhesVenda && (
        <div className={s.modalOverlay}>
          <div className={s.modal}>
            <div className={s.modalHeader}>
              <h3>Venda #{detalhesVenda.id}</h3>
              <button onClick={() => setDetalhesVenda(null)}><X size={20}/></button>
            </div>
            <div className={s.modalBody}>
              <p><strong>Responsável:</strong> {detalhesVenda.cliente}</p>
              <p><strong>Data:</strong> {new Date(detalhesVenda.data).toLocaleDateString('pt-BR')}</p>
              <div className={s.divider}></div>
              <h4>Produtos Vendidos:</h4>
              <ul className={s.productList}>
                {detalhesVenda.itens.map((item, idx) => (
                  <li key={idx}>
                    <span>{item.produto}</span>
                  </li>
                ))}
              </ul>
              <div className={s.modalTotal}>
                <span>Total</span>
                <span>{detalhesVenda.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className={s.modalOverlay}>
          <div className={`${s.modal} ${s.modalLarge}`}>
            <div className={s.modalHeader}>
              <h3>Nova Venda</h3>
              <button onClick={() => setIsAddModalOpen(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmitVenda} className={s.form}>
              <div className={s.formRow}>
                <div className={s.formGroup}>
                  <label>Cliente (Opcional)</label>
                  <input 
                    type="text" 
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
                  Total: {calcularTotalNovaVenda().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
                <button type="submit" className={s.btnSubmit}>Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}