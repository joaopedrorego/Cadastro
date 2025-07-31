class FormaPagamento {
    constructor({ tipo, nome, descricao, taxa = 0, ativo = true }) {
        this.tipo = tipo // 'dinheiro', 'cartao_credito', 'cartao_debito', 'pix', 'boleto', 'transferencia'
        this.nome = nome
        this.descricao = descricao
        this.taxa = parseFloat(taxa) // Taxa percentual cobrada
        this.ativo = ativo
        this.criadoEm = new Date().toISOString()
    }

    static getTiposPagamento() {
        return [
            { value: 'dinheiro', label: 'Dinheiro', taxa: 0, icone: '💰' },
            { value: 'pix', label: 'PIX', taxa: 0, icone: '📱' },
            { value: 'cartao_debito', label: 'Cartão de Débito', taxa: 1.5, icone: '💳' },
            { value: 'cartao_credito', label: 'Cartão de Crédito', taxa: 3.5, icone: '💳' },
            { value: 'boleto', label: 'Boleto Bancário', taxa: 2.5, icone: '📄' },
            { value: 'transferencia', label: 'Transferência Bancária', taxa: 0, icone: '🏦' }
        ]
    }

    static calcularTaxa(valor, taxa) {
        return (valor * taxa) / 100
    }

    calcularValorComTaxa(valor) {
        return valor + FormaPagamento.calcularTaxa(valor, this.taxa)
    }

    calcularValorLiquido(valor) {
        return valor - FormaPagamento.calcularTaxa(valor, this.taxa)
    }
}

export { FormaPagamento }