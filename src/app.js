
import {Quadro} from "./models/Quadro.js"
import {BancoDados} from "./db/db.js"
import {ClienteControle} from "./controllers/Cliente.js"
import {CobrancaControle} from "./controllers/Cobranca.js"

//1 - INICIALIZANDO BANCO DE DADOS
BancoDados.inicializandoBancoDados()

//2 - ADICIONANDO DADOS DE EXEMPLO SE O BANCO ESTIVER VAZIO
function adicionarDadosExemplo() {
    const clientes = BancoDados.get("clientes")
    const cobrancas = BancoDados.get("cobrancas")
    
    if (clientes.length === 0) {
        // Adicionar clientes de exemplo
        const clientesExemplo = [
            { nome: "João Silva", cpf: "123.456.789-00", telefone: "(11) 99999-9999" },
            { nome: "Maria Santos", cpf: "987.654.321-00", telefone: "(11) 88888-8888" },
            { nome: "Pedro Oliveira", cpf: "456.789.123-00", telefone: "(11) 77777-7777" }
        ]
        
        clientesExemplo.forEach(cliente => {
            ClienteControle.cadastrarCliente(cliente)
        })
    }
    
    if (cobrancas.length === 0) {
        // Adicionar cobranças de exemplo
        const cobrancasExemplo = [
            { descricao: "Serviço de consultoria", valor: "1500.00", cliente: 1, status: true, data: "2024-01-15" },
            { descricao: "Desenvolvimento de website", valor: "2500.00", cliente: 2, status: false, data: "2024-01-20" },
            { descricao: "Manutenção de sistema", valor: "800.00", cliente: 3, status: true, data: "2024-01-10" }
        ]
        
        cobrancasExemplo.forEach(cobranca => {
            CobrancaControle.cadastrarCobranca(cobranca)
        })
    }
}

//3 - INICIALIANDO O SELECT COM CLIENTES/COBRANÇAS JÁ PRÉ CADASTRADOS
adicionarDadosExemplo()
Quadro.inicializandoAplicacao()

//4 - INTERCEPTANDO EVENTOS DO FORMULÁRIO - SUBMIT 
const btnCadastrarCliente = document.querySelector("body")
btnCadastrarCliente.addEventListener("submit", Quadro.capturarDados.bind(Quadro))



