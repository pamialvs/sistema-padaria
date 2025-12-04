import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, Search, Plus, Edit, Trash2, MapPin, 
  Phone, Mail, LayoutDashboard, ShoppingCart, 
  Package, FileText, LogOut, X, UserCheck
} from "lucide-react";
import s from './clientes.module.scss';

export default function Clientes() {
  const navigate = useNavigate();
  
  // Estado real dos dados
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: "", email: "", telefone: "", endereco: "" });

  // --- 1. BUSCAR CLIENTES DO BACKEND ---
  const fetchClientes = async () => {
    try {
        const res = await fetch("http://localhost:3000/clientes");
        const data = await res.json();
        
        // Mapear campos do banco (minusculas) para o frontend
        const formatados = data.map(c => ({
            id: c.idcliente,
            nome: c.nomecliente,
            email: c.emailcliente || "Sem email",
            telefone: c.telefonecliente || "-",
            endereco: c.enderecocliente || "-",
            totalCompras: 0, // Campo calculado fictício para a PoC (pois falta relação no banco)
            status: "Ativo"
        }));
        setClientes(formatados);
    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  // --- FILTROS ---
  const clientesFiltrados = clientes.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telefone.includes(searchTerm)
  );

  // --- CRUD ---
  const openModal = () => {
    setFormData({ nome: "", email: "", telefone: "", endereco: "" });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
          await fetch(`http://localhost:3000/clientes/${id}`, { method: 'DELETE' });
          alert("Cliente removido!");
          fetchClientes(); // Atualiza a lista
      } catch (err) {
          alert("Erro ao excluir.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const res = await fetch("http://localhost:3000/clientes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            alert("Cliente cadastrado com sucesso!");
            setIsModalOpen(false);
            fetchClientes(); // Atualiza a lista em tempo real
        } else {
            alert("Erro ao cadastrar.");
        }
    } catch (err) {
        console.error(err);
        alert("Erro de conexão.");
    }
  };

  return (
    <div className={s.layout}>
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

      <main className={s.content}>
        <header className={s.pageHeader}>
          <div>
            <h2 className={s.title}>Clientes</h2>
            <p className={s.subtitle}>Gerencie sua base de clientes fiéis</p>
          </div>
          <button className={s.btnAdd} onClick={openModal}>
            <Plus size={18} /> Novo Cliente
          </button>
        </header>

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
                    <td>
                      <span className={`${s.statusBadge} ${s.ativo}`}>Ativo</span>
                    </td>
                    <td className={s.actions}>
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

      {isModalOpen && (
        <div className={s.modalOverlay}>
          <div className={s.modal}>
            <div className={s.modalHeader}>
              <h3>Novo Cliente</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className={s.form}>
              <div className={s.formGroup}>
                <label>Nome Completo</label>
                <input type="text" required value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} />
              </div>
              <div className={s.formRow}>
                <div className={s.formGroup}>
                  <label>Telefone</label>
                  <input type="text" value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} />
                </div>
                <div className={s.formGroup}>
                  <label>E-mail</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className={s.formGroup}>
                <label>Endereço</label>
                <input type="text" value={formData.endereco} onChange={(e) => setFormData({...formData, endereco: e.target.value})} />
              </div>
              <button type="submit" className={s.btnSubmit}>Cadastrar Cliente</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}