import { useState, useEffect } from 'react'
import { PagamentoService } from '../services/PagamentoService'
import { FormaPagamento } from '../models/FormaPagamento'

export const usePagamentos = () => {
    const [pagamentos, setPagamentos] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Carregar pagamentos do localStorage na inicialização
    useEffect(() => {
        carregarPagamentos()
    }, [])

    const carregarPagamentos = () => {
        try {
            setLoading(true)
            setError(null)
            const pagamentosCarregados = PagamentoService.pegarPagamentos()
            setPagamentos(pagamentosCarregados)
        } catch (err) {
            setError('Erro ao carregar pagamentos')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const registrarPagamento = (dadosPagamento) => {
        try {
            setError(null)
            const validacao = PagamentoService.validarPagamento(dadosPagamento)
            
            if (!validacao.valido) {
                throw new Error(validacao.erros.join(', '))
            }

            const novoPagamento = PagamentoService.registrarPagamento(dadosPagamento)
            setPagamentos(prev => [...prev, novoPagamento])
            return novoPagamento
        } catch (err) {
            setError(err.message || 'Erro ao registrar pagamento')
            console.error(err)
            throw err
        }
    }

    const atualizarPagamento = (id, dadosAtualizados) => {
        try {
            setError(null)
            const pagamentoAtualizado = PagamentoService.atualizarPagamento(id, dadosAtualizados)
            setPagamentos(prev => 
                prev.map(pagamento => 
                    pagamento.id === id ? pagamentoAtualizado : pagamento
                )
            )
            return pagamentoAtualizado
        } catch (err) {
            setError('Erro ao atualizar pagamento')
            console.error(err)
            throw err
        }
    }

    const confirmarPagamento = (id) => {
        try {
            setError(null)
            const pagamentoConfirmado = PagamentoService.confirmarPagamento(id)
            setPagamentos(prev => 
                prev.map(pagamento => 
                    pagamento.id === id ? pagamentoConfirmado : pagamento
                )
            )
            return pagamentoConfirmado
        } catch (err) {
            setError('Erro ao confirmar pagamento')
            console.error(err)
            throw err
        }
    }

    const cancelarPagamento = (id, motivo) => {
        try {
            setError(null)
            const pagamentoCancelado = PagamentoService.cancelarPagamento(id, motivo)
            setPagamentos(prev => 
                prev.map(pagamento => 
                    pagamento.id === id ? pagamentoCancelado : pagamento
                )
            )
            return pagamentoCancelado
        } catch (err) {
            setError('Erro ao cancelar pagamento')
            console.error(err)
            throw err
        }
    }

    const removerPagamento = (id) => {
        try {
            setError(null)
            PagamentoService.deletarPagamento(id)
            setPagamentos(prev => prev.filter(pagamento => pagamento.id !== id))
        } catch (err) {
            setError('Erro ao remover pagamento')
            console.error(err)
            throw err
        }
    }

    const buscarPagamentoPorId = (id) => {
        return PagamentoService.pegarPagamentoPorId(id)
    }

    const buscarPagamentosPorCobranca = (cobrancaId) => {
        return PagamentoService.pegarPagamentosPorCobranca(cobrancaId)
    }

    const buscarPagamentoPorIdentificador = (identificador) => {
        return PagamentoService.pegarPagamentoPorIdentificador(identificador)
    }

    const obterEstatisticas = () => {
        return PagamentoService.obterEstatisticasPagamentos()
    }

    const obterPagamentosPorFormaPagamento = () => {
        return PagamentoService.obterPagamentosPorFormaPagamento()
    }

    const gerarRelatorioPagamentos = (filtros) => {
        return PagamentoService.gerarRelatorioPagamentos(filtros)
    }

    const obterFormasPagamento = () => {
        return FormaPagamento.getTiposPagamento()
    }

    const calcularTaxa = (valor, formaPagamento) => {
        const forma = obterFormasPagamento().find(f => f.value === formaPagamento)
        return forma ? FormaPagamento.calcularTaxa(valor, forma.taxa) : 0
    }

    const calcularValorLiquido = (valor, formaPagamento) => {
        const taxa = calcularTaxa(valor, formaPagamento)
        return valor - taxa
    }

    const estatisticas = {
        ...obterEstatisticas(),
        porFormaPagamento: obterPagamentosPorFormaPagamento()
    }

    return {
        pagamentos,
        loading,
        error,
        estatisticas,
        carregarPagamentos,
        registrarPagamento,
        atualizarPagamento,
        confirmarPagamento,
        cancelarPagamento,
        removerPagamento,
        buscarPagamentoPorId,
        buscarPagamentosPorCobranca,
        buscarPagamentoPorIdentificador,
        gerarRelatorioPagamentos,
        obterFormasPagamento,
        calcularTaxa,
        calcularValorLiquido
    }
}