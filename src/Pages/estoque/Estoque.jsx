import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Package, AlertTriangle, AlertCircle, Clock, Search, Filter,
    Plus, Edit, Trash2, X, LayoutDashboard, ShoppingCart,
    LogOut, FileText, Users
} from "lucide-react";
// Importar o arquivo SCSS adaptado
import s from '../estoque/estoque.module.scss'; 
// import { toast } from "@/hooks/use-toast"; // Assumindo que toast está disponível

// --- TIPAGEM (Apenas para referência no código JSX) ---
/**
 * @typedef {'ok' | 'baixo' | 'critico'} ProductStatus
 * @typedef {{ id: string, name: string, category: string, quantity: number, minQuantity: number, status: ProductStatus }} Product
 */

// --- FUNÇÕES AUXILIARES ---
/**
 * @param {number} quantity
 * @param {number} minQuantity
 * @returns {ProductStatus}
 */
const calculateStatus = (quantity, minQuantity) => {
    if (quantity <= minQuantity * 0.3) return "critico";
    if (quantity <= minQuantity) return "baixo";
    return "ok";
};

// --- DADOS MOCKADOS ---
/** @type {Product[]} */
const initialProducts = [
    { id: "1", name: "Pão Francês", category: "paes", quantity: 150, minQuantity: 50, status: calculateStatus(150, 50) },
    { id: "2", name: "Coxinha", category: "salgados", quantity: 25, minQuantity: 30, status: calculateStatus(25, 30) },
    { id: "3", name: "Refrigerante Coca 2L", category: "bebidas", quantity: 45, minQuantity: 20, status: calculateStatus(45, 20) },
    { id: "4", name: "Suco de Laranja", category: "bebidas", quantity: 8, minQuantity: 15, status: calculateStatus(8, 15) },
    { id: "5", name: "Farinha de Trigo 5kg", category: "ingredientes", quantity: 12, minQuantity: 10, status: calculateStatus(12, 10) },
    { id: "6", name: "Fermento Biológico", category: "ingredientes", quantity: 3, minQuantity: 5, status: calculateStatus(3, 5) },
    { id: "7", name: "Pão de Queijo", category: "salgados", quantity: 60, minQuantity: 40, status: calculateStatus(60, 40) },
    { id: "8", name: "Croissant", category: "paes", quantity: 18, minQuantity: 25, status: calculateStatus(18, 25) },
];

export default function GerenciarEstoque() {
    const navigate = useNavigate();
    const [products, setProducts] = useState(initialProducts);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [searchTerm, setSearchTerm] = useState(""); // Novo: Filtro de busca

    // Modais
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    /** @type {[Product | null, React.Dispatch<React.SetStateAction<Product | null>>]} */
    const [productToEdit, setProductToEdit] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    // --- LÓGICA DE FILTRAGEM E ORDENAÇÃO ---

    const availableCategories = useMemo(() => {
        const categories = new Set(products.map(p => p.category));
        return ["all", ...Array.from(categories)].sort();
    }, [products]);

    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        // 1. Filtro de Busca
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (p) => p.name.toLowerCase().includes(lowerCaseSearch)
            );
        }

        // 2. Filtro de Categoria
        if (categoryFilter !== "all") {
            filtered = filtered.filter((p) => p.category === categoryFilter);
        }
        
        // 3. Filtro de Status
        if (statusFilter !== "all") {
            filtered = filtered.filter((p) => p.status === statusFilter);
        }

        // 4. Ordenação
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "quantity":
                    return b.quantity - a.quantity;
                case "category":
                    return a.category.localeCompare(b.category);
                case "status":
                    const statusOrder = { critico: 0, baixo: 1, ok: 2 };
                    return statusOrder[a.status] - statusOrder[b.status];
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        return filtered;
    }, [products, categoryFilter, statusFilter, sortBy, searchTerm]);

    const stats = useMemo(() => ({
        total: products.length,
        lowStock: products.filter((p) => p.status === "baixo").length,
        critical: products.filter((p) => p.status === "critico").length,
    }), [products]);

    const handleResetFilters = () => {
        setCategoryFilter("all");
        setStatusFilter("all");
        setSortBy("name");
        setSearchTerm("");
    };

    // --- FUNÇÕES CRUD ---

    /**
     * @param {{ name: string, category: string, quantity: number, minQuantity: number }} newProductData
     */
    const handleAddProduct = (newProductData) => {
        const status = calculateStatus(newProductData.quantity, newProductData.minQuantity);

        /** @type {Product} */
        const product = {
            id: Date.now().toString(),
            ...newProductData,
            status,
        };

        setProducts((prev) => [...prev, product]);
        setIsAddModalOpen(false);
        // toast({ title: "Produto adicionado", description: `${newProductData.name} foi adicionado ao estoque.` });
        alert(`Produto adicionado: ${newProductData.name}`);
    };

    /**
     * Prepara o modal de edição
     * @param {Product} product
     */
    const handleEditClick = (product) => {
        setProductToEdit(product);
        setIsEditModalOpen(true);
    };

    /**
     * Salva o produto editado
     * @param {Product} updatedProduct
     */
    const handleEditProduct = (updatedProduct) => {
        // Recalcula o status
        const newStatus = calculateStatus(updatedProduct.quantity, updatedProduct.minQuantity);
        
        const finalProduct = { ...updatedProduct, status: newStatus };

        setProducts((prev) => 
            prev.map((p) => (p.id === finalProduct.id ? finalProduct : p))
        );
        setProductToEdit(null);
        setIsEditModalOpen(false);
        // toast({ title: "Produto atualizado", description: `${updatedProduct.name} foi modificado.` });
        alert(`Produto atualizado: ${updatedProduct.name}`);
    };

    /**
     * @param {Product} product
     */
    const handleDeleteProduct = (product) => {
        if (!window.confirm(`Tem certeza que deseja remover ${product.name} do estoque?`)) return;

        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        // toast({ title: "Produto removido", description: `${product.name} foi removido do estoque.`, variant: "destructive" });
        alert(`Produto removido: ${product.name}`);
    };

    return (
        <div className={s.layout}>

            {/* SIDEBAR - Estrutura copiada de GerenciarVendas */}
            <aside className={s.sidebar}>
                <div className={s.logoContainer}><h1 className={s.logo}>PÃO DOURADO</h1></div>
                <nav className={s.nav}>
                    <a href="/dashboard" className={s.navItem}><LayoutDashboard size={20}/> <span>Dashboard</span></a>
                    <a href="/vendas" className={s.navItem}><ShoppingCart size={20}/> <span>Vendas</span></a>
                    <a href="/estoque" className={`${s.navItem} ${s.active}`}><Package size={20}/> <span>Estoque</span></a>
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
                        <h2 className={s.title}>Gerenciar Estoque</h2>
                        <p className={s.subtitle}>Produtos, ingredientes e status de reposição</p>
                    </div>
                    <button className={s.btnAdd} onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={18} /> Novo Produto
                    </button>
                </header>

                {/* STAT CARDS - Adaptados para usar as classes SCSS */}
                <div className={s.statsGrid}>
                    <div className={s.statCard}>
                        <div className={s.statInfo}>
                            <span>Total de Itens</span>
                            <strong>{stats.total}</strong>
                        </div>
                        <div className={`${s.iconWrapper} ${s.blue}`}><Package size={24} /></div>
                    </div>
                    <div className={s.statCard}>
                        <div className={s.statInfo}>
                            <span>Baixo Estoque</span>
                            <strong>{stats.lowStock}</strong>
                        </div>
                        <div className={`${s.iconWrapper} ${s.yellow}`}><AlertTriangle size={24} /></div>
                    </div>
                    <div className={s.statCard}>
                        <div className={s.statInfo}>
                            <span>Itens Críticos</span>
                            <strong>{stats.critical}</strong>
                        </div>
                        <div className={`${s.iconWrapper} ${s.red}`}><AlertCircle size={24} /></div>
                    </div>
                    <div className={s.statCard}>
                        <div className={s.statInfo}>
                            <span>Última Atualização</span>
                            <strong>Agora</strong>
                        </div>
                        <div className={`${s.iconWrapper} ${s.gray}`}><Clock size={24} /></div>
                    </div>
                </div>

                {/* FILTROS E TABELA - Adaptados para usar as classes SCSS */}
                <div className={s.tableCard}>
                    <div className={s.filters}>
                        {/* Busca */}
                        <div className={s.searchBox}>
                            <Search className={s.searchIcon} size={18} />
                            <input 
                                type="text" 
                                placeholder="Buscar por nome..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        {/* Filtro de Categoria */}
                        <select 
                            className={s.selectFilter} 
                            value={categoryFilter} 
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="all">Todas Categorias</option>
                            {availableCategories.filter(c => c !== 'all').map(c => (
                                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                            ))}
                        </select>
                        
                        {/* Filtro de Status */}
                        <select 
                            className={s.selectFilter} 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Todos Status</option>
                            <option value="ok">OK</option>
                            <option value="baixo">Baixo Estoque</option>
                            <option value="critico">Crítico</option>
                        </select>

                        <button onClick={handleResetFilters} className={s.actionBtn} style={{border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 10px'}}><Filter size={18} /> Limpar</button>
                    </div>

                    <div className={s.tableResponsive}>
                        <table className={s.table}>
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>Categoria</th>
                                    <th>Estoque Atual</th>
                                    <th>Estoque Mín.</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>{product.category}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.minQuantity}</td>
                                        <td>
                                            <span className={`${s.statusBadge} ${s[product.status]}`}>
                                                {product.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <button className={s.actionBtn} onClick={() => handleEditClick(product)}>
                                                <Edit size={18} />
                                            </button>
                                            <button className={s.actionBtn} onClick={() => handleDeleteProduct(product)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* --- MODAL DE NOVO PRODUTO (Baseado no modal de Nova Venda) --- */}
            <AddProductModal 
                open={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onAdd={handleAddProduct}
                categories={availableCategories.filter(c => c !== 'all')}
                scss={s}
            />

            {/* --- MODAL DE EDIÇÃO DE PRODUTO --- */}
            {isEditModalOpen && productToEdit && (
                <EditProductModal 
                    open={isEditModalOpen} 
                    onClose={() => { setIsEditModalOpen(false); setProductToEdit(null); }} 
                    onSave={handleEditProduct}
                    product={productToEdit}
                    categories={availableCategories.filter(c => c !== 'all')}
                    scss={s}
                />
            )}
        </div>
    );
}

// --- Componente Modal de Adição de Produto (Novo/Adaptado) ---
const AddProductModal = ({ open, onClose, onAdd, categories, scss }) => {
    const [formData, setFormData] = useState({
        name: "",
        category: categories.length > 0 ? categories[0] : "",
        quantity: 0,
        minQuantity: 0,
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        // Reset form
        setFormData({
            name: "",
            category: categories.length > 0 ? categories[0] : "",
            quantity: 0,
            minQuantity: 0,
        });
    };

    if (!open) return null;

    return (
        <div className={scss.modalOverlay}>
            <div className={scss.modal}>
                <div className={scss.modalHeader}>
                    <h3>Adicionar Novo Produto</h3>
                    <button onClick={onClose}><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className={scss.form}>
                    <div className={scss.formGroup}>
                        <label>Nome do Produto</label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required 
                            placeholder="Ex: Pão de Forma"
                        />
                    </div>
                    <div className={scss.formRow}>
                        <div className={scss.formGroup}>
                            <label>Categoria</label>
                            <select 
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                {categories.map(c => (
                                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div className={scss.formGroup}>
                            <label>Estoque Mínimo</label>
                            <input 
                                type="number" 
                                name="minQuantity"
                                value={formData.minQuantity}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>
                    </div>
                    <div className={scss.formGroup}>
                        <label>Quantidade Inicial</label>
                        <input 
                            type="number" 
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>
                    
                    <div className={scss.modalFooter}>
                        <button type="button" onClick={onClose} className={scss.btnCancel}>Cancelar</button>
                        <button type="submit" className={scss.btnSubmit}>Adicionar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Componente Modal de Edição de Produto (Novo/Adaptado) ---
const EditProductModal = ({ open, onClose, onSave, product, categories, scss }) => {
    // Inicializa o formulário com os dados do produto
    const [formData, setFormData] = useState({
        id: product.id,
        name: product.name,
        category: product.category,
        quantity: product.quantity,
        minQuantity: product.minQuantity,
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData); // Chama a função de salvar no componente pai
    };

    if (!open) return null;

    return (
        <div className={scss.modalOverlay}>
            <div className={scss.modal}>
                <div className={scss.modalHeader}>
                    <h3>Editar Produto: {product.name}</h3>
                    <button onClick={onClose}><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className={scss.form}>
                    <div className={scss.formGroup}>
                        <label>Nome do Produto</label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    <div className={scss.formRow}>
                        <div className={scss.formGroup}>
                            <label>Categoria</label>
                            <select 
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                {categories.map(c => (
                                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div className={scss.formGroup}>
                            <label>Estoque Mínimo</label>
                            <input 
                                type="number" 
                                name="minQuantity"
                                value={formData.minQuantity}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>
                    </div>
                    <div className={scss.formGroup}>
                        <label>Quantidade Atual</label>
                        <input 
                            type="number" 
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>
                    
                    <div className={scss.modalFooter}>
                        <button type="button" onClick={onClose} className={scss.btnCancel}>Cancelar</button>
                        <button type="submit" className={scss.btnSubmit}>Salvar Alterações</button>
                    </div>
                </form>
            </div>
        </div>
    );
};