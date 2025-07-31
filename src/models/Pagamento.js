import { FormaPagamento } from './FormaPagamento.js'

class Pagamento {
    constructor({ 
        cobrancaId, 
        formaPagamento, 
        valor, 
        observacoes = '', 
        comprovante = null,
        identificadorPagamento = null 
    }) {
        this.cobrancaId = cobrancaId
        this.formaPagamento = formaPagamento // ID da forma de pagamento
        this.valor = parseFloat(valor)
        this.observacoes = observacoes
        this.comprovante = comprovante // URL ou base64 do comprovante
        this.identificadorPagamento = identificadorPagamento || this.gerarIdentificador()
        this.dataPagamento = new Date().toISOString()
        this.dataRegistro = new Date().toISOString()
        this.status = 'confirmado' // 'pendente', 'confirmado', 'cancelado'
    }

    gerarIdentificador() {
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(2, 8).toUpperCase()
        return `PAG${timestamp}${random}`
    }

    static gerarNumeroTransacao() {
        const agora = new Date()
        const ano = agora.getFullYear().toString().substr(-2)
        const mes = (agora.getMonth() + 1).toString().padStart(2, '0')
        const dia = agora.getDate().toString().padStart(2, '0')
        const hora = agora.getHours().toString().padStart(2, '0')
        const minuto = agora.getMinutes().toString().padStart(2, '0')
        const segundo = agora.getSeconds().toString().padStart(2, '0')
        const random = Math.random().toString().slice(-4)
        
        return `${ano}${mes}${dia}${hora}${minuto}${segundo}${random}`
    }

    calcularTaxa(formaPagamentoObj) {
        if (!formaPagamentoObj) return 0
        return FormaPagamento.calcularTaxa(this.valor, formaPagamentoObj.taxa)
    }

    calcularValorLiquido(formaPagamentoObj) {
        if (!formaPagamentoObj) return this.valor
        return this.valor - this.calcularTaxa(formaPagamentoObj)
    }

    formatarIdentificador() {
        // Formato: PAG-XXXX-XXXX-XXXX
        const id = this.identificadorPagamento.replace('PAG', '')
        return `PAG-${id.substring(0, 4)}-${id.substring(4, 8)}-${id.substring(8, 12)}`
    }
}

export { Pagamento }