import { NotaFiscal } from '../models/NotaFiscal.js'
import { BancoDados } from './BancoDados.js'

class NotaFiscalService {
    
    static emitirNotaFiscal(dadosNota) {
        const novaNotaFiscal = new NotaFiscal(dadosNota)
        return BancoDados.post("notasFiscais", novaNotaFiscal)
    }

    static pegarNotasFiscais() {
        return BancoDados.get("notasFiscais")
    }

    static pegarNotaFiscalPorId(id) {
        const notas = this.pegarNotasFiscais()
        return notas.find(nota => nota.id === id)
    }

    static pegarNotaFiscalPorCobranca(cobrancaId) {
        const notas = this.pegarNotasFiscais()
        return notas.find(nota => nota.cobrancaId === cobrancaId)
    }

    static pegarNotaFiscalPorPagamento(pagamentoId) {
        const notas = this.pegarNotasFiscais()
        return notas.find(nota => nota.pagamentoId === pagamentoId)
    }

    static pegarNotaFiscalPorNumero(numero) {
        const notas = this.pegarNotasFiscais()
        return notas.find(nota => nota.numero === numero)
    }

    static atualizarNotaFiscal(id, dadosAtualizados) {
        return BancoDados.update("notasFiscais", id, dadosAtualizados)
    }

    static cancelarNotaFiscal(id, motivo = '') {
        return this.atualizarNotaFiscal(id, {
            status: 'cancelada',
            motivoCancelamento: motivo,
            dataCancelamento: new Date().toISOString()
        })
    }

    static enviarNotaFiscal(id, email = '') {
        return this.atualizarNotaFiscal(id, {
            status: 'enviada',
            emailEnvio: email,
            dataEnvio: new Date().toISOString()
        })
    }

    static deletarNotaFiscal(id) {
        BancoDados.delete("notasFiscais", id)
    }

    static obterEstatisticasNotasFiscais() {
        const notas = this.pegarNotasFiscais()
        
        const stats = {
            total: notas.length,
            emitidas: notas.filter(n => n.status === 'emitida').length,
            enviadas: notas.filter(n => n.status === 'enviada').length,
            canceladas: notas.filter(n => n.status === 'cancelada').length,
            valorTotalServicos: notas.reduce((total, nota) => total + nota.valorServico, 0),
            valorTotalImpostos: notas.reduce((total, nota) => total + nota.impostos.total, 0),
            valorTotalLiquido: notas.reduce((total, nota) => total + nota.valorLiquido, 0)
        }

        return stats
    }

    static obterNotasPorRegimeTributario() {
        const notas = this.pegarNotasFiscais()
        const grupos = {}

        notas.forEach(nota => {
            const regime = nota.regime
            if (!grupos[regime]) {
                grupos[regime] = {
                    quantidade: 0,
                    valorServicos: 0,
                    valorImpostos: 0,
                    notas: []
                }
            }
            grupos[regime].quantidade++
            grupos[regime].valorServicos += nota.valorServico
            grupos[regime].valorImpostos += nota.impostos.total
            grupos[regime].notas.push(nota)
        })

        return grupos
    }

    static obterNotasPorTipoServico() {
        const notas = this.pegarNotasFiscais()
        const grupos = {}

        notas.forEach(nota => {
            const tipo = nota.tipoServico
            if (!grupos[tipo]) {
                grupos[tipo] = {
                    quantidade: 0,
                    valorServicos: 0,
                    notas: []
                }
            }
            grupos[tipo].quantidade++
            grupos[tipo].valorServicos += nota.valorServico
            grupos[tipo].notas.push(nota)
        })

        return grupos
    }

    static obterNotasPorPeriodo(dataInicio, dataFim) {
        const notas = this.pegarNotasFiscais()
        const inicio = new Date(dataInicio)
        const fim = new Date(dataFim)

        return notas.filter(nota => {
            const dataEmissao = new Date(nota.dataEmissao)
            return dataEmissao >= inicio && dataEmissao <= fim
        })
    }

    static gerarRelatorioFiscal(filtros = {}) {
        let notas = this.pegarNotasFiscais()

        // Aplicar filtros
        if (filtros.status) {
            notas = notas.filter(n => n.status === filtros.status)
        }

        if (filtros.regime) {
            notas = notas.filter(n => n.regime === filtros.regime)
        }

        if (filtros.tipoServico) {
            notas = notas.filter(n => n.tipoServico === filtros.tipoServico)
        }

        if (filtros.dataInicio && filtros.dataFim) {
            notas = this.obterNotasPorPeriodo(filtros.dataInicio, filtros.dataFim)
        }

        // Calcular estatísticas detalhadas
        const relatorio = {
            periodo: {
                inicio: filtros.dataInicio || 'Desde o início',
                fim: filtros.dataFim || 'Até agora'
            },
            resumo: {
                totalNotas: notas.length,
                valorBrutoServicos: notas.reduce((total, n) => total + n.valorServico, 0),
                valorTotalImpostos: notas.reduce((total, n) => total + n.impostos.total, 0),
                valorLiquido: notas.reduce((total, n) => total + n.valorLiquido, 0),
                ticketMedio: notas.length > 0 ? 
                    notas.reduce((total, n) => total + n.valorServico, 0) / notas.length : 0
            },
            impostos: {
                iss: notas.reduce((total, n) => total + (n.impostos.iss || 0), 0),
                inss: notas.reduce((total, n) => total + (n.impostos.inss || 0), 0),
                ir: notas.reduce((total, n) => total + (n.impostos.ir || 0), 0),
                cofins: notas.reduce((total, n) => total + (n.impostos.cofins || 0), 0),
                pis: notas.reduce((total, n) => total + (n.impostos.pis || 0), 0),
                csll: notas.reduce((total, n) => total + (n.impostos.csll || 0), 0)
            },
            porRegime: this.obterNotasPorRegimeTributario(),
            porTipoServico: this.obterNotasPorTipoServico(),
            notas: notas.sort((a, b) => new Date(b.dataEmissao) - new Date(a.dataEmissao))
        }

        return relatorio
    }

    static validarNotaFiscal(dadosNota) {
        const erros = []

        if (!dadosNota.cobrancaId) {
            erros.push('Cobrança é obrigatória')
        }

        if (!dadosNota.clienteId) {
            erros.push('Cliente é obrigatório')
        }

        if (!dadosNota.valorServico || dadosNota.valorServico <= 0) {
            erros.push('Valor do serviço deve ser maior que zero')
        }

        if (!dadosNota.descricaoServico || dadosNota.descricaoServico.trim().length < 10) {
            erros.push('Descrição do serviço deve ter pelo menos 10 caracteres')
        }

        return {
            valido: erros.length === 0,
            erros
        }
    }

    static obterDiretrizesCompletas() {
        return {
            prazos: {
                emissao: "Emitir até 5 dias após prestação do serviço",
                recolhimento: "Recolher impostos até dia 20 do mês seguinte",
                arquivamento: "Manter por 5 anos (digital) ou 10 anos (físico)"
            },
            obrigatoriedades: {
                dados_cliente: "Nome/Razão Social, CPF/CNPJ, endereço completo",
                dados_servico: "Descrição detalhada, código de serviço, valor",
                impostos: "Discriminar todos os impostos incidentes",
                assinatura: "Assinatura digital ou física do prestador"
            },
            regimes_tributarios: {
                simples_nacional: {
                    aliquota: "6% a 19% conforme faturamento anual",
                    impostos: "DAS unificado (ISS, INSS, IR, PIS, COFINS, CSLL)",
                    observacoes: "Não gera crédito fiscal"
                },
                lucro_presumido: {
                    iss: "2% a 5% conforme município",
                    inss: "11% sobre valor do serviço",
                    ir: "1,5% sobre valor do serviço",
                    pis_cofins: "3,65% sobre valor do serviço"
                },
                lucro_real: {
                    calculo: "Baseado no lucro efetivo da empresa",
                    complexidade: "Maior controle contábil necessário"
                }
            },
            cancelamento: {
                prazo: "Até 24h após emissão ou conforme legislação municipal",
                motivos: "Erro na emissão, duplicidade, desistência do cliente",
                substitutiva: "Emitir nova nota quando necessário"
            }
        }
    }

    static gerarGuiaRecolhimento(notaFiscalId) {
        const nota = this.pegarNotaFiscalPorId(notaFiscalId)
        if (!nota) return null

        const guia = {
            notaFiscal: nota.formatarNumero(),
            dataVencimento: nota.dataVencimento,
            impostos: nota.impostos,
            valorTotal: nota.impostos.total,
            codigoBarras: this.gerarCodigoBarras(nota),
            instrucoesRecolhimento: [
                "Pagar até a data de vencimento para evitar multa e juros",
                "Código de receita conforme regime tributário",
                "Guardar comprovante de pagamento",
                "Enviar cópia para contabilidade"
            ]
        }

        return guia
    }

    static gerarCodigoBarras(nota) {
        // Simulação de código de barras para recolhimento
        const timestamp = Date.now().toString().slice(-10)
        const valor = Math.floor(nota.impostos.total * 100).toString().padStart(8, '0')
        const regime = nota.regime === 'simples_nacional' ? '01' : '02'
        
        return `${regime}${timestamp}${valor}`.substring(0, 47)
    }
}

export { NotaFiscalService }