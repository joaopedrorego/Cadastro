import { Pagamento } from '../models/Pagamento.js'
import { BancoDados } from './BancoDados.js'

class PagamentoService {
    
    static registrarPagamento(dadosPagamento) {
        const novoPagamento = new Pagamento(dadosPagamento)
        return BancoDados.post("pagamentos", novoPagamento)
    }

    static pegarPagamentos() {
        return BancoDados.get("pagamentos")
    }

    static pegarPagamentosPorCobranca(cobrancaId) {
        const pagamentos = this.pegarPagamentos()
        return pagamentos.filter(pagamento => pagamento.cobrancaId === cobrancaId)
    }

    static pegarPagamentoPorId(id) {
        const pagamentos = this.pegarPagamentos()
        return pagamentos.find(pagamento => pagamento.id === id)
    }

    static pegarPagamentoPorIdentificador(identificador) {
        const pagamentos = this.pegarPagamentos()
        return pagamentos.find(pagamento => 
            pagamento.identificadorPagamento === identificador ||
            pagamento.formatarIdentificador() === identificador
        )
    }

    static atualizarPagamento(id, dadosAtualizados) {
        return BancoDados.update("pagamentos", id, dadosAtualizados)
    }

    static cancelarPagamento(id, motivo = '') {
        return this.atualizarPagamento(id, { 
            status: 'cancelado',
            motivoCancelamento: motivo,
            dataCancelamento: new Date().toISOString()
        })
    }

    static confirmarPagamento(id) {
        return this.atualizarPagamento(id, { 
            status: 'confirmado',
            dataConfirmacao: new Date().toISOString()
        })
    }

    static deletarPagamento(id) {
        BancoDados.delete("pagamentos", id)
    }

    static calcularTotalPagamentos(filtroStatus = null) {
        const pagamentos = this.pegarPagamentos()
        let pagamentosFiltrados = pagamentos

        if (filtroStatus) {
            pagamentosFiltrados = pagamentos.filter(pagamento => pagamento.status === filtroStatus)
        }

        return pagamentosFiltrados.reduce((total, pagamento) => total + pagamento.valor, 0)
    }

    static obterEstatisticasPagamentos() {
        const pagamentos = this.pegarPagamentos()
        
        const stats = {
            total: pagamentos.length,
            confirmados: pagamentos.filter(p => p.status === 'confirmado').length,
            pendentes: pagamentos.filter(p => p.status === 'pendente').length,
            cancelados: pagamentos.filter(p => p.status === 'cancelado').length,
            valorTotal: this.calcularTotalPagamentos(),
            valorConfirmado: this.calcularTotalPagamentos('confirmado'),
            valorPendente: this.calcularTotalPagamentos('pendente')
        }

        return stats
    }

    static obterPagamentosPorFormaPagamento() {
        const pagamentos = this.pegarPagamentos()
        const grupos = {}

        pagamentos.forEach(pagamento => {
            const forma = pagamento.formaPagamento
            if (!grupos[forma]) {
                grupos[forma] = {
                    quantidade: 0,
                    valor: 0,
                    pagamentos: []
                }
            }
            grupos[forma].quantidade++
            grupos[forma].valor += pagamento.valor
            grupos[forma].pagamentos.push(pagamento)
        })

        return grupos
    }

    static obterPagamentosPorPeriodo(dataInicio, dataFim) {
        const pagamentos = this.pegarPagamentos()
        const inicio = new Date(dataInicio)
        const fim = new Date(dataFim)

        return pagamentos.filter(pagamento => {
            const dataPagamento = new Date(pagamento.dataPagamento)
            return dataPagamento >= inicio && dataPagamento <= fim
        })
    }

    static gerarRelatorioPagamentos(filtros = {}) {
        let pagamentos = this.pegarPagamentos()

        // Aplicar filtros
        if (filtros.status) {
            pagamentos = pagamentos.filter(p => p.status === filtros.status)
        }

        if (filtros.formaPagamento) {
            pagamentos = pagamentos.filter(p => p.formaPagamento === filtros.formaPagamento)
        }

        if (filtros.dataInicio && filtros.dataFim) {
            pagamentos = this.obterPagamentosPorPeriodo(filtros.dataInicio, filtros.dataFim)
        }

        // Calcular estatísticas
        const relatorio = {
            periodo: {
                inicio: filtros.dataInicio || 'Desde o início',
                fim: filtros.dataFim || 'Até agora'
            },
            resumo: {
                totalPagamentos: pagamentos.length,
                valorTotal: pagamentos.reduce((total, p) => total + p.valor, 0),
                ticketMedio: pagamentos.length > 0 ? 
                    pagamentos.reduce((total, p) => total + p.valor, 0) / pagamentos.length : 0
            },
            porFormaPagamento: this.obterPagamentosPorFormaPagamento(),
            pagamentos: pagamentos.sort((a, b) => new Date(b.dataPagamento) - new Date(a.dataPagamento))
        }

        return relatorio
    }

    static validarPagamento(dadosPagamento) {
        const erros = []

        if (!dadosPagamento.cobrancaId) {
            erros.push('Cobrança é obrigatória')
        }

        if (!dadosPagamento.formaPagamento) {
            erros.push('Forma de pagamento é obrigatória')
        }

        if (!dadosPagamento.valor || dadosPagamento.valor <= 0) {
            erros.push('Valor deve ser maior que zero')
        }

        return {
            valido: erros.length === 0,
            erros
        }
    }
}

export { PagamentoService }