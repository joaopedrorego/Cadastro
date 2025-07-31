import { CheckCircle, Edit, Trash2, Circle } from 'lucide-react'
import { useCobrancas } from '../hooks/useCobrancas'
import { useClientes } from '../hooks/useClientes'

const CobrancasList = ({ onEdit, searchTerm = '' }) => {
    const { cobrancas, marcarComoPaga, marcarComoPendente, removerCobranca } = useCobrancas()
    const { buscarClientePorId } = useClientes()

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const handleStatusToggle = (cobranca) => {
        if (cobranca.status) {
            marcarComoPendente(cobranca.id)
        } else {
            marcarComoPaga(cobranca.id)
        }
    }

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta cobrança?')) {
            removerCobranca(id)
        }
    }

    // Filtrar cobranças baseado no termo de pesquisa
    const cobrancasFiltradas = cobrancas.filter(cobranca => {
        if (!searchTerm) return true
        
        const cliente = buscarClientePorId(cobranca.cliente)
        const clienteNome = cliente?.nome.toLowerCase() || ''
        const descricao = cobranca.descricao.toLowerCase()
        const searchLower = searchTerm.toLowerCase()
        
        return clienteNome.includes(searchLower) || 
               descricao.includes(searchLower) ||
               cobranca.id.toString().includes(searchLower)
    })

    if (cobrancasFiltradas.length === 0) {
        return (
            <div className="empty-state">
                <p>
                    {searchTerm 
                        ? `Nenhuma cobrança encontrada para "${searchTerm}"` 
                        : 'Nenhuma cobrança cadastrada'
                    }
                </p>
            </div>
        )
    }

    return (
        <div className="cobrancas-list">
            <header className="list-header">
                <div className="header-status">Status</div>
                <div className="header-cliente">Cliente</div>
                <div className="header-descricao">Descrição</div>
                <div className="header-valor">Valor</div>
                <div className="header-data">Data de emissão</div>
                <div className="header-actions">Ações</div>
            </header>

            <ul className="list-content">
                {cobrancasFiltradas.map((cobranca) => {
                    const cliente = buscarClientePorId(cobranca.cliente)
                    
                    return (
                        <li 
                            key={cobranca.id} 
                            className={`cobranca-item ${cobranca.status ? 'paga' : 'pendente'}`}
                        >
                            <div className="item-status">
                                <button
                                    onClick={() => handleStatusToggle(cobranca)}
                                    className={`status-btn ${cobranca.status ? 'paid' : 'pending'}`}
                                    title={cobranca.status ? 'Marcar como pendente' : 'Marcar como paga'}
                                >
                                    {cobranca.status ? (
                                        <CheckCircle size={20} />
                                    ) : (
                                        <Circle size={20} />
                                    )}
                                </button>
                            </div>
                            
                            <div className="item-cliente">
                                <h3>{cliente?.nome || 'Cliente não encontrado'}</h3>
                                <small>{cliente?.cpf}</small>
                            </div>
                            
                            <div className="item-descricao">
                                <p>{cobranca.descricao}</p>
                            </div>
                            
                            <div className="item-valor">
                                <strong>{formatCurrency(cobranca.valor)}</strong>
                            </div>
                            
                            <div className="item-data">
                                <p>{cobranca.data}</p>
                            </div>

                            <div className="item-actions">
                                <button
                                    onClick={() => onEdit?.(cobranca)}
                                    className="action-btn edit-btn"
                                    title="Editar cobrança"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(cobranca.id)}
                                    className="action-btn delete-btn"
                                    title="Excluir cobrança"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default CobrancasList