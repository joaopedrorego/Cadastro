import { useState, useEffect } from 'react'
import { NotaFiscalService } from '../services/NotaFiscalService'
import { NotaFiscal } from '../models/NotaFiscal'

export const useNotasFiscais = () => {
    const [notasFiscais, setNotasFiscais] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Carregar notas fiscais do localStorage na inicialização
    useEffect(() => {
        carregarNotasFiscais()
    }, [])

    const carregarNotasFiscais = () => {
        try {
            setLoading(true)
            setError(null)
            const notasCarregadas = NotaFiscalService.pegarNotasFiscais()
            setNotasFiscais(notasCarregadas)
        } catch (err) {
            setError('Erro ao carregar notas fiscais')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const emitirNotaFiscal = (dadosNota) => {
        try {
            setError(null)
            const validacao = NotaFiscalService.validarNotaFiscal(dadosNota)
            
            if (!validacao.valido) {
                throw new Error(validacao.erros.join(', '))
            }

            const novaNotaFiscal = NotaFiscalService.emitirNotaFiscal(dadosNota)
            setNotasFiscais(prev => [...prev, novaNotaFiscal])
            return novaNotaFiscal
        } catch (err) {
            setError(err.message || 'Erro ao emitir nota fiscal')
            console.error(err)
            throw err
        }
    }

    const atualizarNotaFiscal = (id, dadosAtualizados) => {
        try {
            setError(null)
            const notaAtualizada = NotaFiscalService.atualizarNotaFiscal(id, dadosAtualizados)
            setNotasFiscais(prev => 
                prev.map(nota => 
                    nota.id === id ? notaAtualizada : nota
                )
            )
            return notaAtualizada
        } catch (err) {
            setError('Erro ao atualizar nota fiscal')
            console.error(err)
            throw err
        }
    }

    const cancelarNotaFiscal = (id, motivo) => {
        try {
            setError(null)
            const notaCancelada = NotaFiscalService.cancelarNotaFiscal(id, motivo)
            setNotasFiscais(prev => 
                prev.map(nota => 
                    nota.id === id ? notaCancelada : nota
                )
            )
            return notaCancelada
        } catch (err) {
            setError('Erro ao cancelar nota fiscal')
            console.error(err)
            throw err
        }
    }

    const enviarNotaFiscal = (id, email) => {
        try {
            setError(null)
            const notaEnviada = NotaFiscalService.enviarNotaFiscal(id, email)
            setNotasFiscais(prev => 
                prev.map(nota => 
                    nota.id === id ? notaEnviada : nota
                )
            )
            return notaEnviada
        } catch (err) {
            setError('Erro ao enviar nota fiscal')
            console.error(err)
            throw err
        }
    }

    const removerNotaFiscal = (id) => {
        try {
            setError(null)
            NotaFiscalService.deletarNotaFiscal(id)
            setNotasFiscais(prev => prev.filter(nota => nota.id !== id))
        } catch (err) {
            setError('Erro ao remover nota fiscal')
            console.error(err)
            throw err
        }
    }

    const buscarNotaFiscalPorId = (id) => {
        return NotaFiscalService.pegarNotaFiscalPorId(id)
    }

    const buscarNotaFiscalPorCobranca = (cobrancaId) => {
        return NotaFiscalService.pegarNotaFiscalPorCobranca(cobrancaId)
    }

    const buscarNotaFiscalPorPagamento = (pagamentoId) => {
        return NotaFiscalService.pegarNotaFiscalPorPagamento(pagamentoId)
    }

    const buscarNotaFiscalPorNumero = (numero) => {
        return NotaFiscalService.pegarNotaFiscalPorNumero(numero)
    }

    const obterEstatisticas = () => {
        return NotaFiscalService.obterEstatisticasNotasFiscais()
    }

    const obterNotasPorRegime = () => {
        return NotaFiscalService.obterNotasPorRegimeTributario()
    }

    const obterNotasPorTipoServico = () => {
        return NotaFiscalService.obterNotasPorTipoServico()
    }

    const gerarRelatorioFiscal = (filtros) => {
        return NotaFiscalService.gerarRelatorioFiscal(filtros)
    }

    const obterDiretrizes = () => {
        return NotaFiscalService.obterDiretrizesCompletas()
    }

    const gerarGuiaRecolhimento = (notaFiscalId) => {
        return NotaFiscalService.gerarGuiaRecolhimento(notaFiscalId)
    }

    const obterTiposServico = () => {
        return NotaFiscal.getTiposServico()
    }

    const obterRegimesTributarios = () => {
        return NotaFiscal.getRegimesTributarios()
    }

    const estatisticas = {
        ...obterEstatisticas(),
        porRegime: obterNotasPorRegime(),
        porTipoServico: obterNotasPorTipoServico()
    }

    const diretrizes = obterDiretrizes()

    return {
        notasFiscais,
        loading,
        error,
        estatisticas,
        diretrizes,
        carregarNotasFiscais,
        emitirNotaFiscal,
        atualizarNotaFiscal,
        cancelarNotaFiscal,
        enviarNotaFiscal,
        removerNotaFiscal,
        buscarNotaFiscalPorId,
        buscarNotaFiscalPorCobranca,
        buscarNotaFiscalPorPagamento,
        buscarNotaFiscalPorNumero,
        gerarRelatorioFiscal,
        gerarGuiaRecolhimento,
        obterTiposServico,
        obterRegimesTributarios
    }
}