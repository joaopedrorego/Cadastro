import { useState } from 'react'
import { useNotasFiscais } from '../hooks/useNotasFiscais'
import { useClientes } from '../hooks/useClientes'
import { FileText, Info } from 'lucide-react'

const NotaFiscalForm = ({ onSuccess, onCancel, cobranca = null, pagamento = null }) => {
    const { emitirNotaFiscal, obterTiposServico, obterRegimesTributarios } = useNotasFiscais()
    const { buscarClientePorId } = useClientes()
    
    const [formData, setFormData] = useState({
        cobrancaId: cobranca?.id || '',
        pagamentoId: pagamento?.id || '',
        clienteId: cobranca?.cliente || '',
        valorServico: cobranca?.valor || pagamento?.valor || '',
        descricaoServico: cobranca?.descricao || '',
        tipoServico: cobranca?.tipoServico || 'consultoria',
        regime: 'simples_nacional'
    })
    
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [impostos, setImpostos] = useState(null)

    const tiposServico = obterTiposServico()
    const regimesTributarios = obterRegimesTributarios()
    const cliente = formData.clienteId ? buscarClientePorId(formData.clienteId) : null

    const calcularImpostosPreview = () => {
        if (!formData.valorServico || !formData.regime) return null

        const valor = parseFloat(formData.valorServico)
        let impostos = {
            iss: 0,
            inss: 0,
            ir: 0,
            cofins: 0,
            pis: 0,
            csll: 0,
            total: 0
        }

        if (formData.regime === 'simples_nacional') {
            const aliquota = 6 // Simplificado
            impostos.total = (valor * aliquota) / 100
            impostos.iss = impostos.total * 0.4
        } else if (formData.regime === 'lucro_presumido') {
            impostos.iss = (valor * 5) / 100
            impostos.inss = (valor * 11) / 100
            impostos.ir = (valor * 1.5) / 100
            impostos.cofins = (valor * 3) / 100
            impostos.pis = (valor * 0.65) / 100
            impostos.csll = (valor * 1) / 100
            
            impostos.total = impostos.iss + impostos.inss + impostos.ir + 
                           impostos.cofins + impostos.pis + impostos.csll
        }

        return impostos
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.cobrancaId) {
            newErrors.cobrancaId = 'Cobrança é obrigatória'
        }

        if (!formData.clienteId) {
            newErrors.clienteId = 'Cliente é obrigatório'
        }

        if (!formData.valorServico || formData.valorServico <= 0) {
            newErrors.valorServico = 'Valor do serviço deve ser maior que zero'
        }

        if (!formData.descricaoServico || formData.descricaoServico.trim().length < 10) {
            newErrors.descricaoServico = 'Descrição deve ter pelo menos 10 caracteres'
        }

        if (!formData.tipoServico) {
            newErrors.tipoServico = 'Tipo de serviço é obrigatório'
        }

        if (!formData.regime) {
            newErrors.regime = 'Regime tributário é obrigatório'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        
        setFormData(prev => ({ ...prev, [name]: value }))

        // Limpar erro do campo quando o usuário começar a digitar
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }

        // Recalcular impostos quando valor ou regime mudar
        if (name === 'valorServico' || name === 'regime') {
            setTimeout(() => {
                const novosImpostos = calcularImpostosPreview()
                setImpostos(novosImpostos)
            }, 100)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            const dadosNota = {
                ...formData,
                valorServico: parseFloat(formData.valorServico),
                clienteId: parseInt(formData.clienteId)
            }

            await emitirNotaFiscal(dadosNota)
            onSuccess?.()
        } catch (error) {
            console.error('Erro ao emitir nota fiscal:', error)
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

    const impostosCalculados = calcularImpostosPreview()

    return (
        <form onSubmit={handleSubmit} className="nota-fiscal-form">
            <div className="form-header">
                <h3>
                    <FileText size={20} />
                    Emitir Nota Fiscal de Serviço
                </h3>
                <div className="alert alert-info">
                    <Info size={16} />
                    <span>Esta nota fiscal será emitida conforme a legislação vigente</span>
                </div>
            </div>

            {cobranca && cliente && (
                <div className="cobranca-info">
                    <h4>Dados da Cobrança</h4>
                    <div className="info-grid">
                        <div>
                            <strong>Cliente:</strong> {cliente.nome}
                        </div>
                        <div>
                            <strong>CPF/CNPJ:</strong> {cliente.cpf}
                        </div>
                        <div>
                            <strong>Valor:</strong> {formatCurrency(cobranca.valor)}
                        </div>
                        <div>
                            <strong>Data:</strong> {cobranca.data}
                        </div>
                    </div>
                </div>
            )}

            <div className="form-section">
                <h4>Dados do Serviço</h4>
                
                <div className="form-group">
                    <label htmlFor="descricaoServico">Descrição do Serviço</label>
                    <textarea
                        id="descricaoServico"
                        name="descricaoServico"
                        value={formData.descricaoServico}
                        onChange={handleChange}
                        placeholder="Descrição detalhada do serviço prestado"
                        rows="3"
                        className={errors.descricaoServico ? 'error' : ''}
                    />
                    {errors.descricaoServico && <span className="error-message">{errors.descricaoServico}</span>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="tipoServico">Tipo de Serviço</label>
                        <select
                            id="tipoServico"
                            name="tipoServico"
                            value={formData.tipoServico}
                            onChange={handleChange}
                            className={errors.tipoServico ? 'error' : ''}
                        >
                            {tiposServico.map((tipo) => (
                                <option key={tipo.value} value={tipo.value}>
                                    {tipo.label} (Cód. {tipo.codigo})
                                </option>
                            ))}
                        </select>
                        {errors.tipoServico && <span className="error-message">{errors.tipoServico}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="valorServico">Valor do Serviço</label>
                        <input
                            type="number"
                            id="valorServico"
                            name="valorServico"
                            value={formData.valorServico}
                            onChange={handleChange}
                            placeholder="0,00"
                            step="0.01"
                            min="0"
                            className={errors.valorServico ? 'error' : ''}
                        />
                        {errors.valorServico && <span className="error-message">{errors.valorServico}</span>}
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h4>Regime Tributário</h4>
                
                <div className="form-group">
                    <label htmlFor="regime">Regime Tributário</label>
                    <select
                        id="regime"
                        name="regime"
                        value={formData.regime}
                        onChange={handleChange}
                        className={errors.regime ? 'error' : ''}
                    >
                        {regimesTributarios.map((regime) => (
                            <option key={regime.value} value={regime.value}>
                                {regime.label}
                            </option>
                        ))}
                    </select>
                    {errors.regime && <span className="error-message">{errors.regime}</span>}
                    <small className="info-message">
                        {regimesTributarios.find(r => r.value === formData.regime)?.descricao}
                    </small>
                </div>
            </div>

            {impostosCalculados && (
                <div className="impostos-preview">
                    <h4>Preview dos Impostos</h4>
                    <div className="impostos-grid">
                        <div className="imposto-item">
                            <span>Valor Bruto:</span>
                            <strong>{formatCurrency(parseFloat(formData.valorServico))}</strong>
                        </div>
                        
                        {formData.regime === 'simples_nacional' ? (
                            <>
                                <div className="imposto-item">
                                    <span>DAS Simples (6%):</span>
                                    <strong className="imposto">{formatCurrency(impostosCalculados.total)}</strong>
                                </div>
                                <div className="imposto-item">
                                    <span>ISS (aprox.):</span>
                                    <strong className="imposto">{formatCurrency(impostosCalculados.iss)}</strong>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="imposto-item">
                                    <span>ISS (5%):</span>
                                    <strong className="imposto">{formatCurrency(impostosCalculados.iss)}</strong>
                                </div>
                                <div className="imposto-item">
                                    <span>INSS (11%):</span>
                                    <strong className="imposto">{formatCurrency(impostosCalculados.inss)}</strong>
                                </div>
                                <div className="imposto-item">
                                    <span>IR (1,5%):</span>
                                    <strong className="imposto">{formatCurrency(impostosCalculados.ir)}</strong>
                                </div>
                                <div className="imposto-item">
                                    <span>PIS/COFINS (3,65%):</span>
                                    <strong className="imposto">{formatCurrency(impostosCalculados.pis + impostosCalculados.cofins)}</strong>
                                </div>
                                <div className="imposto-item">
                                    <span>CSLL (1%):</span>
                                    <strong className="imposto">{formatCurrency(impostosCalculados.csll)}</strong>
                                </div>
                            </>
                        )}
                        
                        <div className="imposto-item total">
                            <span>Total dos Impostos:</span>
                            <strong>{formatCurrency(impostosCalculados.total)}</strong>
                        </div>
                        
                        <div className="imposto-item total">
                            <span>Valor Líquido:</span>
                            <strong className="valor-liquido">
                                {formatCurrency(parseFloat(formData.valorServico) - impostosCalculados.total)}
                            </strong>
                        </div>
                    </div>
                </div>
            )}

            <div className="diretrizes-info">
                <h4>Diretrizes Fiscais</h4>
                <div className="diretrizes-list">
                    <div className="diretriz-item">
                        <strong>Prazo de Emissão:</strong> Até 5 dias após a prestação do serviço
                    </div>
                    <div className="diretriz-item">
                        <strong>Recolhimento:</strong> Impostos devem ser recolhidos até o dia 20 do mês seguinte
                    </div>
                    <div className="diretriz-item">
                        <strong>Arquivamento:</strong> Manter documentos por 5 anos (digital) ou 10 anos (físico)
                    </div>
                    <div className="diretriz-item">
                        <strong>Cancelamento:</strong> Possível até 24h após emissão
                    </div>
                </div>
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
                    <FileText size={16} />
                    {loading ? 'Emitindo...' : 'Emitir Nota Fiscal'}
                </button>
            </div>
        </form>
    )
}

export default NotaFiscalForm