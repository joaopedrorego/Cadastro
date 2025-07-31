import { useState } from 'react'
import { useClientes } from '../hooks/useClientes'

const ClienteForm = ({ onSuccess, onCancel, cliente = null }) => {
    const { adicionarCliente, atualizarCliente } = useClientes()
    const [formData, setFormData] = useState({
        nome: cliente?.nome || '',
        cpf: cliente?.cpf || '',
        telefone: cliente?.telefone || ''
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const validateForm = () => {
        const newErrors = {}

        if (!formData.nome.trim()) {
            newErrors.nome = 'Nome é obrigatório'
        }

        if (!formData.cpf.trim()) {
            newErrors.cpf = 'CPF é obrigatório'
        } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
            newErrors.cpf = 'CPF deve estar no formato 000.000.000-00'
        }

        if (!formData.telefone.trim()) {
            newErrors.telefone = 'Telefone é obrigatório'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        
        // Formatação automática para CPF
        if (name === 'cpf') {
            const cpfValue = value.replace(/\D/g, '')
            const formattedCpf = cpfValue
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1')
            
            setFormData(prev => ({ ...prev, [name]: formattedCpf }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }

        // Limpar erro do campo quando o usuário começar a digitar
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            if (cliente) {
                await atualizarCliente(cliente.id, formData)
            } else {
                await adicionarCliente(formData)
            }
            
            onSuccess?.()
        } catch (error) {
            console.error('Erro ao salvar cliente:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="cliente-form">
            <div className="form-group">
                <label htmlFor="nome">Nome Completo</label>
                <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Nome Completo"
                    className={errors.nome ? 'error' : ''}
                />
                {errors.nome && <span className="error-message">{errors.nome}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="cpf">CPF</label>
                <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    maxLength="14"
                    className={errors.cpf ? 'error' : ''}
                />
                {errors.cpf && <span className="error-message">{errors.cpf}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999"
                    className={errors.telefone ? 'error' : ''}
                />
                {errors.telefone && <span className="error-message">{errors.telefone}</span>}
            </div>

            <div className="form-actions">
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="btn-secondary"
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Salvando...' : (cliente ? 'Atualizar' : 'Cadastrar')} Cliente
                </button>
            </div>
        </form>
    )
}

export default ClienteForm