import { useState, useEffect } from 'react'
import { BancoDados } from './services/BancoDados'
import { initializeTestData } from './data/initialData'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Modal from './components/Modal'
import ClienteForm from './components/ClienteForm'
import CobrancaForm from './components/CobrancaForm'
import CobrancasList from './components/CobrancasList'
import SearchBar from './components/SearchBar'
import PagamentoForm from './components/PagamentoForm'
import NotaFiscalForm from './components/NotaFiscalForm'
import { useCobrancas } from './hooks/useCobrancas'
import { usePagamentos } from './hooks/usePagamentos'
import { useNotasFiscais } from './hooks/useNotasFiscais'
import './App.css'

function App() {
    const [activeTab, setActiveTab] = useState('cobrancas')
    const [showClienteModal, setShowClienteModal] = useState(false)
    const [showCobrancaModal, setShowCobrancaModal] = useState(false)
    const [editingCobranca, setEditingCobranca] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const { estatisticas } = useCobrancas()

    // Inicializar banco de dados quando a aplicação carrega
    useEffect(() => {
        BancoDados.inicializandoBancoDados()
        // Adicionar dados de teste se necessário
        setTimeout(() => {
            initializeTestData()
        }, 100)
    }, [])

    const handleClienteSuccess = () => {
        setShowClienteModal(false)
    }

    const handleCobrancaSuccess = () => {
        setShowCobrancaModal(false)
        setEditingCobranca(null)
    }

    const handleEditCobranca = (cobranca) => {
        setEditingCobranca(cobranca)
        setShowCobrancaModal(true)
    }

    const handleNewCobranca = () => {
        setEditingCobranca(null)
        setShowCobrancaModal(true)
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <div className="dashboard">
                        <h2>Dashboard</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Total de Cobranças</h3>
                                <p className="stat-number">{estatisticas.totalCobrancas}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Cobranças Pagas</h3>
                                <p className="stat-number paid">{estatisticas.cobrancasPagas}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Cobranças Pendentes</h3>
                                <p className="stat-number pending">{estatisticas.cobrancasPendentes}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Valor Total</h3>
                                <p className="stat-value">
                                    {new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }).format(estatisticas.total)}
                                </p>
                            </div>
                        </div>
                    </div>
                )
            
            case 'extrato':
                return (
                    <div className="extrato">
                        <h2>Extrato</h2>
                        <div className="extrato-summary">
                            <div className="summary-item">
                                <strong>Total Recebido:</strong>
                                <span className="value-paid">
                                    {new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }).format(estatisticas.pagas)}
                                </span>
                            </div>
                            <div className="summary-item">
                                <strong>Total Pendente:</strong>
                                <span className="value-pending">
                                    {new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }).format(estatisticas.pendentes)}
                                </span>
                            </div>
                        </div>
                    </div>
                )

            case 'cobrancas':
                return (
                    <div className="cobrancas-section">
                        <div className="section-header">
                            <h2>Cobranças</h2>
                            <button 
                                className="btn-primary"
                                onClick={handleNewCobranca}
                            >
                                Nova Cobrança
                            </button>
                        </div>
                        
                        <SearchBar 
                            onSearch={setSearchTerm}
                            placeholder="Pesquise cobranças pelo nome do cliente"
                        />
                        
                        <CobrancasList 
                            onEdit={handleEditCobranca}
                            searchTerm={searchTerm}
                        />
                    </div>
                )

            case 'clientes':
                return (
                    <div className="clientes-section">
                        <div className="section-header">
                            <h2>Clientes</h2>
                            <button 
                                className="btn-primary"
                                onClick={() => setShowClienteModal(true)}
                            >
                                Novo Cliente
                            </button>
                        </div>
                        <p>Seção de clientes em desenvolvimento...</p>
                    </div>
                )

            default:
                return <div>Selecione uma opção do menu</div>
        }
    }

    return (
        <div className="app">
            <Header />
            
            <main className="main-content">
                <div className="sidebar-column">
                    <Sidebar 
                        activeTab={activeTab} 
                        onTabChange={setActiveTab} 
                    />
                </div>
                
                <div className="content-column">
                    {renderContent()}
                </div>
            </main>

            {/* Modal para cadastro de cliente */}
            <Modal
                isOpen={showClienteModal}
                onClose={() => setShowClienteModal(false)}
                title="Cadastrar Cliente"
            >
                <ClienteForm
                    onSuccess={handleClienteSuccess}
                    onCancel={() => setShowClienteModal(false)}
                />
            </Modal>

            {/* Modal para cadastro/edição de cobrança */}
            <Modal
                isOpen={showCobrancaModal}
                onClose={() => {
                    setShowCobrancaModal(false)
                    setEditingCobranca(null)
                }}
                title={editingCobranca ? "Editar Cobrança" : "Cadastrar Cobrança"}
            >
                <CobrancaForm
                    cobranca={editingCobranca}
                    onSuccess={handleCobrancaSuccess}
                    onCancel={() => {
                        setShowCobrancaModal(false)
                        setEditingCobranca(null)
                    }}
                />
            </Modal>
        </div>
    )
}

export default App