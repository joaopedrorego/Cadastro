class NotaFiscal {
    constructor({ 
        cobrancaId, 
        pagamentoId, 
        clienteId, 
        valorServico, 
        descricaoServico, 
        tipoServico = 'consultoria',
        regime = 'simples_nacional' 
    }) {
        this.cobrancaId = cobrancaId
        this.pagamentoId = pagamentoId
        this.clienteId = clienteId
        this.numero = this.gerarNumeroNF()
        this.serie = '001'
        this.valorServico = parseFloat(valorServico)
        this.descricaoServico = descricaoServico
        this.tipoServico = tipoServico
        this.regime = regime
        
        // Cálculo automático de impostos
        this.impostos = this.calcularImpostos()
        this.valorTotal = this.valorServico
        this.valorLiquido = this.valorServico - this.impostos.total
        
        // Dados da nota fiscal
        this.dataEmissao = new Date().toISOString()
        this.dataVencimento = this.calcularDataVencimento()
        this.status = 'emitida' // 'rascunho', 'emitida', 'enviada', 'cancelada'
        this.chaveAcesso = this.gerarChaveAcesso()
        this.protocolo = this.gerarProtocolo()
        
        // Diretrizes e observações
        this.observacoes = this.gerarObservacoes()
        this.diretrizes = this.obterDiretrizes()
    }

    gerarNumeroNF() {
        const agora = new Date()
        const ano = agora.getFullYear()
        const mes = (agora.getMonth() + 1).toString().padStart(2, '0')
        const dia = agora.getDate().toString().padStart(2, '0')
        const sequencial = Math.floor(Math.random() * 999) + 1
        
        return `${ano}${mes}${dia}${sequencial.toString().padStart(3, '0')}`
    }

    gerarChaveAcesso() {
        // Simulação de chave de acesso NFSe (44 dígitos)
        const timestamp = Date.now().toString()
        const random = Math.random().toString().replace('0.', '')
        const chave = (timestamp + random).substring(0, 44)
        return chave.padEnd(44, '0')
    }

    gerarProtocolo() {
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(2, 6).toUpperCase()
        return `PROT${timestamp}${random}`
    }

    calcularDataVencimento() {
        const dataEmissao = new Date()
        dataEmissao.setDate(dataEmissao.getDate() + 30) // 30 dias para vencimento
        return dataEmissao.toISOString()
    }

    calcularImpostos() {
        const impostos = {
            iss: 0,
            inss: 0,
            ir: 0,
            cofins: 0,
            pis: 0,
            csll: 0,
            total: 0
        }

        if (this.regime === 'simples_nacional') {
            // Simples Nacional - Anexo III (Serviços)
            const aliquota = this.obterAliquotaSimplesNacional()
            impostos.total = (this.valorServico * aliquota) / 100
            impostos.iss = impostos.total * 0.4 // Aproximadamente 40% do total é ISS
            
        } else if (this.regime === 'lucro_presumido') {
            // Lucro Presumido
            impostos.iss = (this.valorServico * 5) / 100 // 5% ISS
            impostos.inss = (this.valorServico * 11) / 100 // 11% INSS
            impostos.ir = (this.valorServico * 1.5) / 100 // 1,5% IR
            impostos.cofins = (this.valorServico * 3) / 100 // 3% COFINS
            impostos.pis = (this.valorServico * 0.65) / 100 // 0,65% PIS
            impostos.csll = (this.valorServico * 1) / 100 // 1% CSLL
            
            impostos.total = impostos.iss + impostos.inss + impostos.ir + 
                           impostos.cofins + impostos.pis + impostos.csll
        }

        return impostos
    }

    obterAliquotaSimplesNacional() {
        // Simplificação - na prática seria baseado no faturamento anual
        const faixas = [
            { ate: 180000, aliquota: 6 },
            { ate: 360000, aliquota: 8.5 },
            { ate: 720000, aliquota: 10.5 },
            { ate: 1800000, aliquota: 14 },
            { ate: 3600000, aliquota: 17.5 },
            { ate: 4800000, aliquota: 19 }
        ]
        
        // Retorna a primeira faixa para simplificação
        return faixas[0].aliquota
    }

    gerarObservacoes() {
        let obs = []
        
        if (this.regime === 'simples_nacional') {
            obs.push("Documento emitido por ME/EPP optante pelo Simples Nacional.")
            obs.push("Não gera direito a crédito fiscal de IPI, ICMS, ISS e Contribuições Federais.")
        }
        
        obs.push("Serviço prestado em conformidade com a legislação municipal vigente.")
        obs.push(`Forma de pagamento conforme acordo comercial.`)
        
        if (this.tipoServico === 'consultoria') {
            obs.push("Consultoria especializada conforme escopo definido em contrato.")
        }
        
        return obs.join(' | ')
    }

    obterDiretrizes() {
        return {
            emissao: {
                prazo: "A nota fiscal deve ser emitida até 5 dias após a prestação do serviço",
                documentos: "Manter cópias dos comprovantes de pagamento e contratos",
                validade: "Documento válido por 90 dias após a emissão"
            },
            impostos: {
                recolhimento: "Impostos devem ser recolhidos até o dia 20 do mês subsequente",
                regime: `Regime tributário: ${this.regime.replace('_', ' ').toUpperCase()}`,
                iss: "ISS devido ao município onde o serviço foi prestado"
            },
            arquivamento: {
                digital: "Manter arquivo digital por no mínimo 5 anos",
                fisico: "Cópia física opcional, mas recomendada",
                backup: "Realizar backup mensal dos documentos fiscais"
            },
            cancelamento: {
                prazo: "Cancelamento possível até 24h após emissão",
                justificativa: "Necessário informar motivo do cancelamento",
                substitutiva: "Emitir nota substitutiva quando aplicável"
            }
        }
    }

    static getTiposServico() {
        return [
            { value: 'consultoria', label: 'Consultoria Empresarial', codigo: '17.23' },
            { value: 'desenvolvimento', label: 'Desenvolvimento de Software', codigo: '01.07' },
            { value: 'design', label: 'Design e Criação', codigo: '13.05' },
            { value: 'manutencao', label: 'Manutenção e Suporte', codigo: '01.08' },
            { value: 'treinamento', label: 'Treinamento e Capacitação', codigo: '08.01' },
            { value: 'marketing', label: 'Marketing Digital', codigo: '17.06' }
        ]
    }

    static getRegimesTributarios() {
        return [
            { 
                value: 'simples_nacional', 
                label: 'Simples Nacional',
                descricao: 'Regime simplificado para ME e EPP'
            },
            { 
                value: 'lucro_presumido', 
                label: 'Lucro Presumido',
                descricao: 'Tributação baseada em percentual de presunção'
            },
            { 
                value: 'lucro_real', 
                label: 'Lucro Real',
                descricao: 'Tributação baseada no lucro efetivo'
            }
        ]
    }

    formatarNumero() {
        return `${this.serie}-${this.numero}`
    }

    formatarChaveAcesso() {
        // Formata a chave de acesso em grupos de 4 dígitos
        return this.chaveAcesso.replace(/(\d{4})/g, '$1 ').trim()
    }

    obterStatusDescricao() {
        const status = {
            'rascunho': 'Rascunho',
            'emitida': 'Emitida',
            'enviada': 'Enviada ao Cliente',
            'cancelada': 'Cancelada'
        }
        return status[this.status] || 'Status Desconhecido'
    }
}

export { NotaFiscal }