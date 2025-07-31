import { useState, useEffect } from 'react'
import { usePagamentos } from '../hooks/usePagamentos'
import { useClientes } from '../hooks/useClientes'
import { CreditCard, Upload } from 'lucide-react'

const PagamentoForm = ({ onSuccess, onCancel, cobranca = null, pagamento = null }) => {
    const { registrarPagamento, atualizarPagamento, obterFormasPagamento, calcularTaxa, calcularValorLiquido } = usePagamentos()
    const { buscarClientePorId } = useClientes()
    
    const [formData, setFormData] = useState({
        cobrancaId: cobranca?.id || '',
        formaPagamento: pagamento?.formaPagamento || '',
        valor: pagamento?.valor || cobranca?.valorPendente || cobranca?.valor || '',
        observacoes: pagamento?.observacoes || '',
        comprovante: pagamento?.comprovante || null,
        identificadorPagamento: pagamento?.identificadorPagamento || ''
    })
    
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [taxa, setTaxa] = useState(0)
    const [valorLiquido, setValorLiquido] = useState(0)

    const formasPagamento = obterFormasPagamento()
    const cliente = cobranca ? buscarClientePorId(cobranca.cliente) : null

    // Calcular taxa e valor líquido quando forma de pagamento ou valor mudar
    useEffect(() => {
        if (formData.valor && formData.formaPagamento) {
            const valorNumerico = parseFloat(formData.valor)
            const taxaCalculada = calcularTaxa(valorNumerico, formData.formaPagamento)
            const liquidoCalculado = calcularValorLiquido(valorNumerico, formData.formaPagamento)
            
            setTaxa(taxaCalculada)
            setValorLiquido(liquidoCalculado)
        } else {
            setTaxa(0)
            setValorLiquido(0)
        }
    }, [formData.valor, formData.formaPagamento, calcularTaxa, calcularValorLiquido])

    const validateForm = () => {
        const newErrors = {}

        if (!formData.cobrancaId) {
            newErrors.cobrancaId = 'Cobrança é obrigatória'
        }

        if (!formData.formaPagamento) {
            newErrors.formaPagamento = 'Forma de pagamento é obrigatória'
        }

        if (!formData.valor || formData.valor <= 0) {
            newErrors.valor = 'Valor deve ser maior que zero'
        }

        if (cobranca && parseFloat(formData.valor) > cobranca.valorPendente) {
            newErrors.valor = `Valor não pode ser maior que o pendente (${formatCurrency(cobranca.valorPendente)})`
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target
        
        if (name === 'comprovante' && files && files[0]) {
            // Converter arquivo para base64 (simulação)
            const reader = new FileReader()
            reader.onload = (event) => {
                setFormData(prev => ({ ...prev, [name]: event.target.result }))
            }
            reader.readAsDataURL(files[0])
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
            const dadosPagamento = {
                ...formData,
                valor: parseFloat(formData.valor)
            }

            if (pagamento) {
                await atualizarPagamento(pagamento.id, dadosPagamento)
            } else {
                await registrarPagamento(dadosPagamento)
            }
            
            onSuccess?.()
        } catch (error) {
            console.error('Erro ao salvar pagamento:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0)
    }

    const getFormaPagamentoInfo = (tipo) => {
        return formasPagamento.find(f => f.value === tipo)
    }

    return (
        <form onSubmit={handleSubmit} className="pagamento-form">
            {cobranca && (
                <div className="cobranca-info">
                    <h3>Cobrança</h3>
                    <div className="info-grid">
                        <div>
                            <strong>Cliente:</strong> {cliente?.nome}
                        </div>
                        <div>
                            <strong>Descrição:</strong> {cobranca.descricao}
                        </div>
                        <div>
                            <strong>Valor Total:</strong> {formatCurrency(cobranca.valor)}
                        </div>
                        <div>
                            <strong>Valor Pendente:</strong> {formatCurrency(cobranca.valorPendente)}
                        </div>
                    </div>
                </div>
            )}

            <div className="form-group">
                <label htmlFor="formaPagamento">Forma de Pagamento</label>
                <select
                    id="formaPagamento"
                    name="formaPagamento"
                    value={formData.formaPagamento}
                    onChange={handleChange}
                    className={errors.formaPagamento ? 'error' : ''}
                >
                    <option value="">Selecione uma forma de pagamento</option>
                    {formasPagamento.map((forma) => (
                        <option key={forma.value} value={forma.value}>
                            {forma.icone} {forma.label} {forma.taxa > 0 && `(Taxa: ${forma.taxa}%)`}
                        </option>
                    ))}
                </select>
                {errors.formaPagamento && <span className="error-message">{errors.formaPagamento}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="valor">Valor do Pagamento</label>
                <input
                    type="number"
                    id="valor"
                    name="valor"
                    value={formData.valor}
                    onChange={handleChange}
                    placeholder="0,00"
                    step="0.01"
                    min="0"
                    className={errors.valor ? 'error' : ''}
                />
                {errors.valor && <span className="error-message">{errors.valor}</span>}
                {formData.valor && (
                    <small className="value-preview">
                        Valor: {formatCurrency(parseFloat(formData.valor))}
                    </small>
                )}
            </div>

            {formData.formaPagamento && formData.valor && (
                <div className="payment-summary">
                    <div className="summary-item">
                        <span>Valor Bruto:</span>
                        <strong>{formatCurrency(parseFloat(formData.valor))}</strong>
                    </div>
                    {taxa > 0 && (
                        <div className="summary-item">
                            <span>Taxa ({getFormaPagamentoInfo(formData.formaPagamento)?.taxa}%):</span>
                            <strong className="taxa">-{formatCurrency(taxa)}</strong>
                        </div>
                    )}
                    <div className="summary-item total">
                        <span>Valor Líquido:</span>
                        <strong>{formatCurrency(valorLiquido)}</strong>
                    </div>
                </div>
            )}

            <div className="form-group">
                <label htmlFor="identificadorPagamento">Identificador do Pagamento</label>
                <input
                    type="text"
                    id="identificadorPagamento"
                    name="identificadorPagamento"
                    value={formData.identificadorPagamento}
                    onChange={handleChange}
                    placeholder="Será gerado automaticamente se vazio"
                    disabled={!!pagamento}
                />
                <small className="info-message">
                    {pagamento 
                        ? `Identificador: ${pagamento.formatarIdentificador()}`
                        : 'Um identificador único será gerado automaticamente'
                    }
                </small>
            </div>

            <div className="form-group">
                <label htmlFor="comprovante">Comprovante de Pagamento</label>
                <div className="file-input-wrapper">
                    <input
                        type="file"
                        id="comprovante"
                        name="comprovante"
                        onChange={handleChange}
                        accept="image/*,.pdf"
                        className="file-input"
                    />
                    <label htmlFor="comprovante" className="file-input-label">
                        <Upload size={20} />
                        {formData.comprovante ? 'Arquivo selecionado' : 'Selecionar arquivo'}
                    </label>
                </div>
                <small className="info-message">
                    Formatos aceitos: JPG, PNG, PDF (máx. 5MB)
                </small>
            </div>

            <div className="form-group">
                <label htmlFor="observacoes">Observações</label>
                <textarea
                    id="observacoes"
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleChange}
                    placeholder="Observações sobre o pagamento (opcional)"
                    rows="3"
                />
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
                    <CreditCard size={16} />
                    {loading ? 'Processando...' : (pagamento ? 'Atualizar' : 'Registrar')} Pagamento
                </button>
            </div>
        </form>
    )
}

export default PagamentoForm