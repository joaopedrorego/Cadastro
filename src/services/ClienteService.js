import { Cliente } from '../models/Cliente.js'
import { BancoDados } from './BancoDados.js'

// CLASSE RESPONSÁVEL POR FAZER A COMUNICAÇÃO ENTRE CLASSE DE MODELAGEM E BANCO DE DADOS
class ClienteService {
    
    // MÉTODO CADASTRAR CLIENTE
    static cadastrarCliente(cliente) {
        // FAZENDO MODELAGEM DO CLIENTE
        const novoCliente = new Cliente(cliente)

        // CADASTRANDO NO BANCO DE DADOS
        return BancoDados.post("clientes", novoCliente)
    }

    // MÉTODO RECUPERAR CLIENTE
    static pegarClientes() {
        // RETORNA TODOS OS CLIENTES DO BANCO DE DADOS
        return BancoDados.get("clientes")
    }

    // MÉTODO DELETAR CLIENTE
    static deletarCliente(id) {
        BancoDados.delete("clientes", id)
    }

    // MÉTODO ATUALIZAR CLIENTE
    static atualizarCliente(id, dadosAtualizados) {
        return BancoDados.update("clientes", id, dadosAtualizados)
    }

    // MÉTODO BUSCAR CLIENTE POR ID
    static buscarClientePorId(id) {
        const clientes = this.pegarClientes()
        return clientes.find(cliente => cliente.id === id)
    }
}

export { ClienteService }