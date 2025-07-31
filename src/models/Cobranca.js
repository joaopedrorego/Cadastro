
class Cobranca {
    constructor({ descricao, valor, cliente, tipoServico = 'consultoria' }) {
        this.data = Cobranca.getData()
        this.descricao = descricao
        this.valor = parseFloat(valor)
        this.cliente = cliente
        this.tipoServico = tipoServico
        this.status = false // false = pendente, true = paga
        this.statusPagamento = 'pendente' // 'pendente', 'parcial', 'pago', 'vencido'
        this.dataVencimento = this.calcularDataVencimento()
        this.pagamentos = [] // Array de IDs de pagamentos relacionados
        this.notaFiscal = null // ID da nota fiscal
        this.valorPago = 0
        this.valorPendente = this.valor
    }

    static getData() {
        return new Date().toLocaleDateString("pt-BR")
    }

    calcularDataVencimento() {
        const hoje = new Date()
        hoje.setDate(hoje.getDate() + 30) // 30 dias a partir da data de criação
        return hoje.toLocaleDateString("pt-BR")
    }

    adicionarPagamento(valorPagamento) {
        this.valorPago += parseFloat(valorPagamento)
        this.valorPendente = this.valor - this.valorPago
        
        if (this.valorPendente <= 0) {
            this.status = true
            this.statusPagamento = 'pago'
        } else if (this.valorPago > 0) {
            this.statusPagamento = 'parcial'
        }
    }

    verificarVencimento() {
        const hoje = new Date()
        const vencimento = new Date(this.dataVencimento.split('/').reverse().join('-'))
        
        if (hoje > vencimento && this.statusPagamento !== 'pago') {
            this.statusPagamento = 'vencido'
        }
    }

    obterStatusDescricao() {
        const status = {
            'pendente': 'Aguardando Pagamento',
            'parcial': 'Parcialmente Pago',
            'pago': 'Pago',
            'vencido': 'Vencido'
        }
        return status[this.statusPagamento] || 'Status Desconhecido'
    }

    obterCorStatus() {
        const cores = {
            'pendente': '#f59e0b', // amarelo
            'parcial': '#3b82f6',  // azul
            'pago': '#10b981',     // verde
            'vencido': '#ef4444'   // vermelho
        }
        return cores[this.statusPagamento] || '#6b7280'
    }
}

export { Cobranca }