import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, Search, Plus, Edit, Trash2, MapPin, 
  Phone, Mail, LayoutDashboard, ShoppingCart, 
  Package, FileText, LogOut, X, UserCheck
} from "lucide-react";
import s from './clientes.module.scss';

// --- DADOS MOCKADOS ---
const mockClientes = [
  { id: 1, nome: "João Silva", email: "joao@gmail.com", telefone: "(11) 99999-1234", endereco: "Rua das Flores, 123", totalCompras: 15, status: "Ativo" },
  { id: 2, nome: "Maria Santos", email: "maria@hotmail.com", telefone: "(11) 98888-5678", endereco: "Av. Paulista, 1000", totalCompras: 8, status: "Ativo" },
  { id: 3, nome: "Carlos Oliveira", email: "carlos@empresa.com", telefone: "(11) 97777-4444", endereco: "Rua Augusta, 500", totalCompras: 2, status: "Inativo" },
  { id: 4, nome: "Ana Pereira", email: "ana.p@gmail.com", telefone: "(11) 96666-3333", endereco: "Al. Lorena, 80", totalCompras: 24, status: "VIP" },
];

export default function Clientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState(mockClientes);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCliente, setCurrentCliente] = useState(null); // Se null = Novo, se objeto = Editando
  const [formData, setFormData] = useState({ nome: "", email: "", telefone: "", endereco: "" });

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  // --- FILTROS ---
  const clientesFiltrados = clientes.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telefone.includes(searchTerm)
  );

  // --- CRUD (Simulado) ---
  const openModal = (cliente = null) => {
    if (cliente) {
      setCurrentCliente(cliente);
      setFormData({ nome: cliente.nome, email: cliente.email, telefone: cliente.telefone, endereco: cliente.endereco });
    } else {
      setCurrentCliente(null);
      setFormData({ nome: "", email: "", telefone: "", endereco: "" });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      setClientes(clientes.filter(c => c.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentCliente) {
      // Editar
      setClientes(clientes.map(c => c.id === currentCliente.id ? { ...c, ...formData } : c));
    } else {
      // Criar
      const novoId = clientes.length + 1;
      setClientes([{ id: novoId, ...formData, totalCompras: 0, status: "Ativo" }, ...clientes]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className={s.layout}>
      
      {/* SIDEBAR */}
      <aside className={s.sidebar}>
        <div className={s.logoContainer}><h1 className={s.logo}>PÃO DOURADO</h1></div>
        <nav className={s.nav}>
          <a href="/dashboard" className={s.navItem}><LayoutDashboard size={20}/> <span>Dashboard</span></a>
          <a href="/vendas" className={s.navItem}><ShoppingCart size={20}/> <span>Vendas</span></a>
          <a href="/estoque" className={s.navItem}><Package size={20}/> <span>Estoque</span></a>
          <a href="#" className={`${s.navItem} ${s.active}`}><Users size={20}/> <span>Clientes</span></a>
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
            <h2 className={s.title}>Clientes</h2>
            <p className={s.subtitle}>Gerencie sua base de clientes fiéis</p>
          </div>
          <button className={s.btnAdd} onClick={() => openModal()}>
            <Plus size={18} /> Novo Cliente
          </button>
        </header>

        {/* CARDS DE RESUMO */}
        <div className={s.statsGrid}>
          <div className={s.statCard}>
            <div className={s.statInfo}>
              <span>Total de Clientes</span>
              <strong>{clientes.length}</strong>
            </div>
            <div className={`${s.iconWrapper} ${s.blue}`}><Users size={24} /></div>
          </div>
          <div className={s.statCard}>
            <div className={s.statInfo}>
              <span>Clientes VIP</span>
              <strong>{clientes.filter(c => c.status === 'VIP').length}</strong>
            </div>
            <div className={`${s.iconWrapper} ${s.gold}`}><UserCheck size={24} /></div>
          </div>
        </div>

        {/* TABELA */}
        <div className={s.mainCard}>
          <div className={s.toolbar}>
            <div className={s.searchBox}>
              <Search className={s.searchIcon} size={18} />
              <input 
                type="text" 
                placeholder="Buscar por nome ou telefone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className={s.tableResponsive}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Nome / Email</th>
                  <th>Contato</th>
                  <th>Endereço</th>
                  <th>Compras</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>
                      <div className={s.userInfo}>
                        <div className={s.avatar}>{cliente.nome.charAt(0)}</div>
                        <div>
                          <p className={s.userName}>{cliente.nome}</p>
                          <p className={s.userEmail}>{cliente.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={s.contactInfo}>
                        <Phone size={14} className={s.iconSmall} /> {cliente.telefone}
                      </div>
                    </td>
                    <td className={s.addressCell}>
                      <MapPin size={14} className={s.iconSmall} /> {cliente.endereco}
                    </td>
                    <td className={s.centerAlign}>
                      <span className={s.comprasBadge}>{cliente.totalCompras}</span>
                    </td>
                    <td>
                      <span className={`${s.statusBadge} ${s[cliente.status.toLowerCase()]}`}>
                        {cliente.status}
                      </span>
                    </td>
                    <td className={s.actions}>
                      <button className={s.actionBtn} onClick={() => openModal(cliente)} title="Editar">
                        <Edit size={16} />
                      </button>
                      <button className={`${s.actionBtn} ${s.delete}`} onClick={() => handleDelete(cliente.id)} title="Excluir">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL DE CADASTRO/EDIÇÃO */}
      {isModalOpen && (
        <div className={s.modalOverlay}>
          <div className={s.modal}>
            <div className={s.modalHeader}>
              <h3>{currentCliente ? "Editar Cliente" : "Novo Cliente"}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className={s.form}>
              <div className={s.formGroup}>
                <label>Nome Completo</label>
                <input 
                  type="text" required 
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                />
              </div>
              
              <div className={s.formRow}>
                <div className={s.formGroup}>
                  <label>Telefone / WhatsApp</label>
                  <input 
                    type="text" required placeholder="(99) 99999-9999"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  />
                </div>
                <div className={s.formGroup}>
                  <label>E-mail</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className={s.formGroup}>
                <label>Endereço</label>
                <input 
                  type="text" placeholder="Rua, Número, Bairro"
                  value={formData.endereco}
                  onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                />
              </div>

              <button type="submit" className={s.btnSubmit}>
                {currentCliente ? "Salvar Alterações" : "Cadastrar Cliente"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}