import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Package, AlertTriangle, AlertCircle, Clock, Search, Filter,
    Plus, Edit, Trash2, X, LayoutDashboard, ShoppingCart,
    LogOut, FileText, Users, Truck, Tag
} from "lucide-react";
import s from '../estoque/estoque.module.scss'; 

// --- FUNÇÕES AUXILIARES ---
const calculateStatus = (quantity, minQuantity) => {
    const min = minQuantity || 10;
    if (quantity <= min * 0.3) return "critico";
    if (quantity <= min) return "baixo";
    return "ok";
};

export default function GerenciarEstoque() {
    const navigate = useNavigate();
    
    // Estados de Dados
    const [products, setProducts] = useState([]); // Itens do Estoque
    const [fornecedores, setFornecedores] = useState([]); // Lista de Fornecedores

    // Filtros
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    // Modais
    const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
    const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

    // --- 1. BUSCAR DADOS DO BACKEND ---
    const fetchData = () => {
        // Carregar Estoque
        fetch("http://localhost:3000/estoque")
            .then(res => res.json())
            .then(data => {
                const estoqueFormatado = data.map(item => ({
                    id: item.iditemestoque,
                    name: item.nomeitemestoque,
                    quantity: item.quantidadeitemestoque,
                    unidade: item.unidademedidaitemestoque,
                    fornecedor: item.nomefornecedor,
                    status: calculateStatus(item.quantidadeitemestoque, 10)
                }));
                setProducts(estoqueFormatado);
            })
            .catch(err => console.error("Erro estoque:", err));

        // Carregar Fornecedores
        fetch("http://localhost:3000/fornecedores")
            .then(res => res.json())
            .then(data => setFornecedores(data))
            .catch(err => console.error("Erro fornecedores:", err));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    // --- 2. FUNÇÕES DE CADASTRO (POST) ---

    // A. Cadastrar Item no Estoque
    const handleAddStock = async (formData) => {
        try {
            const res = await fetch("http://localhost:3000/estoque", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: formData.name,
                    custo: formData.custo,
                    quantidade: formData.quantity,
                    unidade: formData.unidade,
                    idFornecedor: formData.idFornecedor
                })
            });
            if (res.ok) {
                alert("Item adicionado ao estoque!");
                setIsAddStockModalOpen(false);
                fetchData(); // Recarrega a tabela
            } else {
                alert("Erro ao cadastrar item.");
            }
        } catch (error) { console.error(error); alert("Erro de conexão."); }
    };

    // B. Cadastrar Fornecedor
    const handleAddSupplier = async (formData) => {
        try {
            const res = await fetch("http://localhost:3000/fornecedores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert("Fornecedor cadastrado!");
                setIsAddSupplierModalOpen(false);
                fetchData(); // Atualiza o dropdown de fornecedores
            } else {
                alert("Erro ao cadastrar fornecedor.");
            }
        } catch (error) { console.error(error); alert("Erro de conexão."); }
    };

    // C. Cadastrar Produto de Venda (Cardápio)
    const handleAddProduct = async (formData) => {
        try {
            const res = await fetch("http://localhost:3000/produtos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert("Produto adicionado ao Cardápio! Agora aparece em Vendas.");
                setIsAddProductModalOpen(false);
            } else {
                alert("Erro ao cadastrar produto.");
            }
        } catch (error) { console.error(error); alert("Erro de conexão."); }
    };

    // --- LÓGICA DE FILTRAGEM ---
    const filteredProducts = useMemo(() => {
        let filtered = [...products];
        if (searchTerm) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        if (statusFilter !== "all") filtered = filtered.filter(p => p.status === statusFilter);
        return filtered;
    }, [products, statusFilter, searchTerm]);

    const stats = useMemo(() => ({
        total: products.length,
        lowStock: products.filter(p => p.status === "baixo").length,
        critical: products.filter(p => p.status === "critico").length,
    }), [products]);

    return (
        <div className={s.layout}>
            <aside className={s.sidebar}>
                <div className={s.logoContainer}><h1 className={s.logo}>PÃO DOURADO</h1></div>
                <nav className={s.nav}>
                    <a href="/dashboard" className={s.navItem}><LayoutDashboard size={20}/> <span>Dashboard</span></a>
                    <a href="/vendas" className={s.navItem}><ShoppingCart size={20}/> <span>Vendas</span></a>
                    <a href="#" className={`${s.navItem} ${s.active}`}><Package size={20}/> <span>Estoque</span></a>
                    <a href="#" className={s.navItem}><Users size={20}/> <span>Clientes</span></a>
                    <a href="#" className={s.navItem}><FileText size={20}/> <span>Relatórios</span></a>
                </nav>
                <div className={s.sidebarFooter}>
                    <button onClick={handleLogout} className={s.logoutBtn}><LogOut size={20}/> <span>Sair</span></button>
                </div>
            </aside>

            <main className={s.content}>
                <header className={s.pageHeader}>
                    <div>
                        <h2 className={s.title}>Gestão de Recursos</h2>
                        <p className={s.subtitle}>Cadastros gerais e controle de estoque</p>
                    </div>
                    <div style={{display: 'flex', gap: '10px'}}>
                        {/* Botões de Ação Rápida */}
                        <button className={s.btnAdd} onClick={() => setIsAddSupplierModalOpen(true)} style={{backgroundColor: '#8B1C1C'}}>
                            <Truck size={18} /> Fornecedor
                        </button>
                        <button className={s.btnAdd} onClick={() => setIsAddProductModalOpen(true)} style={{backgroundColor: '#2563eb'}}>
                            <Tag size={18} /> Produto (Venda)
                        </button>
                        <button className={s.btnAdd} onClick={() => setIsAddStockModalOpen(true)}>
                            <Plus size={18} /> Item Estoque
                        </button>
                    </div>
                </header>

                <div className={s.statsGrid}>
                    <div className={s.statCard}>
                        <div className={s.statInfo}><span>Total de Itens</span><strong>{stats.total}</strong></div>
                        <div className={`${s.iconWrapper} ${s.blue}`}><Package size={24} /></div>
                    </div>
                    <div className={s.statCard}>
                        <div className={s.statInfo}><span>Baixo Estoque</span><strong>{stats.lowStock}</strong></div>
                        <div className={`${s.iconWrapper} ${s.yellow}`}><AlertTriangle size={24} /></div>
                    </div>
                    <div className={s.statCard}>
                        <div className={s.statInfo}><span>Itens Críticos</span><strong>{stats.critical}</strong></div>
                        <div className={`${s.iconWrapper} ${s.red}`}><AlertCircle size={24} /></div>
                    </div>
                </div>

                <div className={s.tableCard}>
                    <div className={s.filters}>
                        <div className={s.searchBox}>
                            <Search className={s.searchIcon} size={18} />
                            <input type="text" placeholder="Buscar no estoque..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                        </div>
                        <select className={s.selectFilter} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="all">Todos Status</option>
                            <option value="ok">OK</option>
                            <option value="baixo">Baixo</option>
                            <option value="critico">Crítico</option>
                        </select>
                    </div>

                    <div className={s.tableResponsive}>
                        <table className={s.table}>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Fornecedor</th>
                                    <th>Qtd. Atual</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>{product.fornecedor || "-"}</td>
                                        <td>{product.quantity} {product.unidade}</td>
                                        <td><span className={`${s.statusBadge} ${s[product.status]}`}>{product.status.toUpperCase()}</span></td>
                                        <td><button className={s.actionBtn}><Trash2 size={18} /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* --- MODAIS --- */}

            {/* 1. Modal Novo Item de Estoque */}
            {isAddStockModalOpen && (
                <StockModal 
                    onClose={() => setIsAddStockModalOpen(false)} 
                    onSave={handleAddStock}
                    fornecedores={fornecedores}
                    scss={s}
                />
            )}

            {/* 2. Modal Novo Fornecedor */}
            {isAddSupplierModalOpen && (
                <SupplierModal 
                    onClose={() => setIsAddSupplierModalOpen(false)} 
                    onSave={handleAddSupplier}
                    scss={s}
                />
            )}

            {/* 3. Modal Novo Produto (Venda) */}
            {isAddProductModalOpen && (
                <ProductModal 
                    onClose={() => setIsAddProductModalOpen(false)} 
                    onSave={handleAddProduct}
                    scss={s}
                />
            )}
        </div>
    );
}

// --- Componentes dos Modais ---

const StockModal = ({ onClose, onSave, fornecedores, scss }) => {
    const [form, setForm] = useState({ name: "", quantity: 0, custo: 0, unidade: "un", idFornecedor: "" });
    return (
        <div className={scss.modalOverlay}>
            <div className={scss.modal}>
                <div className={scss.modalHeader}><h3>Novo Item de Estoque</h3><button onClick={onClose}><X size={20}/></button></div>
                <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className={scss.form}>
                    <div className={scss.formGroup}><label>Nome</label><input required onChange={e => setForm({...form, name: e.target.value})} placeholder="Ex: Farinha de Trigo"/></div>
                    <div className={scss.formGroup}><label>Fornecedor</label>
                        <select required onChange={e => setForm({...form, idFornecedor: e.target.value})}>
                            <option value="">Selecione...</option>
                            {fornecedores.map(f => <option key={f.idfornecedor} value={f.idfornecedor}>{f.nomefornecedor}</option>)}
                        </select>
                    </div>
                    <div className={scss.formRow}>
                        <div className={scss.formGroup}><label>Qtd</label><input type="number" required onChange={e => setForm({...form, quantity: e.target.value})} /></div>
                        <div className={scss.formGroup}><label>Unidade</label><input required onChange={e => setForm({...form, unidade: e.target.value})} placeholder="kg, cx..." /></div>
                    </div>
                    <div className={scss.formGroup}><label>Custo Unit. (R$)</label><input type="number" step="0.01" onChange={e => setForm({...form, custo: e.target.value})} /></div>
                    <div className={scss.modalFooter}><button type="submit" className={scss.btnSubmit}>Salvar</button></div>
                </form>
            </div>
        </div>
    );
};

const SupplierModal = ({ onClose, onSave, scss }) => {
    const [form, setForm] = useState({ nome: "", contato: "", endereco: "" });
    return (
        <div className={scss.modalOverlay}>
            <div className={scss.modal}>
                <div className={scss.modalHeader}><h3>Novo Fornecedor</h3><button onClick={onClose}><X size={20}/></button></div>
                <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className={scss.form}>
                    <div className={scss.formGroup}><label>Nome Empresa</label><input required onChange={e => setForm({...form, nome: e.target.value})} /></div>
                    <div className={scss.formGroup}><label>Contato/CNPJ</label><input required onChange={e => setForm({...form, contato: e.target.value})} /></div>
                    <div className={scss.formGroup}><label>Endereço</label><input required onChange={e => setForm({...form, endereco: e.target.value})} /></div>
                    <div className={scss.modalFooter}><button type="submit" className={scss.btnSubmit}>Cadastrar</button></div>
                </form>
            </div>
        </div>
    );
};

const ProductModal = ({ onClose, onSave, scss }) => {
    const [form, setForm] = useState({ nome: "", tipo: "Pão", origem: "Feito Manualmente", dataVencimento: "" });
    return (
        <div className={scss.modalOverlay}>
            <div className={scss.modal}>
                <div className={scss.modalHeader}><h3>Novo Produto (Cardápio)</h3><button onClick={onClose}><X size={20}/></button></div>
                <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className={scss.form}>
                    <div className={scss.formGroup}><label>Nome do Produto</label><input required placeholder="Ex: Croissant" onChange={e => setForm({...form, nome: e.target.value})} /></div>
                    <div className={scss.formRow}>
                        <div className={scss.formGroup}><label>Tipo</label>
                            <select onChange={e => setForm({...form, tipo: e.target.value})}>
                                <option value="Pão">Pão</option>
                                <option value="Salgado">Salgado</option>
                                <option value="Doce">Doce</option>
                                <option value="Bebida">Bebida</option>
                            </select>
                        </div>
                        <div className={scss.formGroup}><label>Origem</label>
                            <select onChange={e => setForm({...form, origem: e.target.value})}>
                                <option value="Feito Manualmente">Própria</option>
                                <option value="Comprado">Revenda</option>
                            </select>
                        </div>
                    </div>
                    <div className={scss.formGroup}><label>Validade Estimada</label><input type="date" onChange={e => setForm({...form, dataVencimento: e.target.value})} /></div>
                    <div className={scss.modalFooter}><button type="submit" className={scss.btnSubmit}>Adicionar ao Menu</button></div>
                </form>
            </div>
        </div>
    );
};