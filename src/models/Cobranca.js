
class Cobranca {
    constructor({ descricao, valor, cliente }) {
        this.data = Cobranca.getData()
        this.descricao = descricao
        this.valor = parseFloat(valor)
        this.cliente = cliente
        this.status = false
    }

    static getData() {
        return new Date().toLocaleDateString("pt-BR")
    }
}

export { Cobranca }