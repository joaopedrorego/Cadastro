import { PagamentoService } from '../services/PagamentoService'
import { NotaFiscalService } from '../services/NotaFiscalService'
import { CobrancaService } from '../services/CobrancaService'

export const initializePaymentTestData = () => {
    // Verificar se já existem dados de pagamento
    const existingPagamentos = PagamentoService.pegarPagamentos()
    
    if (existingPagamentos.length === 0) {
        const cobrancas = CobrancaService.pegarCobrancas()
        
        if (cobrancas.length > 0) {
            // Criar alguns pagamentos de teste
            
            // Pagamento completo para primeira cobrança
            const pagamento1 = PagamentoService.registrarPagamento({
                cobrancaId: cobrancas[0].id,
                formaPagamento: 'pix',
                valor: cobrancas[0].valor,
                observacoes: 'Pagamento via PIX - processado automaticamente',
                identificadorPagamento: 'PIX17293847562'
            })

            // Atualizar status da cobrança
            cobrancas[0].adicionarPagamento(pagamento1.valor)
            CobrancaService.atualizarCobranca(cobrancas[0].id, {
                status: true,
                statusPagamento: 'pago',
                valorPago: cobrancas[0].valor,
                valorPendente: 0,
                pagamentos: [pagamento1.id]
            })

            // Emitir nota fiscal para cobrança paga
            const notaFiscal1 = NotaFiscalService.emitirNotaFiscal({
                cobrancaId: cobrancas[0].id,
                pagamentoId: pagamento1.id,
                clienteId: cobrancas[0].cliente,
                valorServico: cobrancas[0].valor,
                descricaoServico: cobrancas[0].descricao,
                tipoServico: cobrancas[0].tipoServico || 'consultoria',
                regime: 'simples_nacional'
            })

            // Associar nota fiscal à cobrança
            CobrancaService.atualizarCobranca(cobrancas[0].id, {
                notaFiscal: notaFiscal1.id
            })

            // Pagamento parcial para segunda cobrança
            if (cobrancas.length > 1) {
                const valorParcial = cobrancas[1].valor * 0.6 // 60% do valor

                const pagamento2 = PagamentoService.registrarPagamento({
                    cobrancaId: cobrancas[1].id,
                    formaPagamento: 'cartao_credito',
                    valor: valorParcial,
                    observacoes: 'Pagamento parcial - primeira parcela',
                    identificadorPagamento: null // Será gerado automaticamente
                })

                // Atualizar status da cobrança
                cobrancas[1].adicionarPagamento(pagamento2.valor)
                CobrancaService.atualizarCobranca(cobrancas[1].id, {
                    statusPagamento: 'parcial',
                    valorPago: valorParcial,
                    valorPendente: cobrancas[1].valor - valorParcial,
                    pagamentos: [pagamento2.id]
                })
            }

            // Pagamento em dinheiro para terceira cobrança
            if (cobrancas.length > 2) {
                const pagamento3 = PagamentoService.registrarPagamento({
                    cobrancaId: cobrancas[2].id,
                    formaPagamento: 'dinheiro',
                    valor: cobrancas[2].valor,
                    observacoes: 'Pagamento em dinheiro - recebido presencialmente',
                    identificadorPagamento: 'CASH' + Date.now()
                })

                // Atualizar status da cobrança
                cobrancas[2].adicionarPagamento(pagamento3.valor)
                CobrancaService.atualizarCobranca(cobrancas[2].id, {
                    status: true,
                    statusPagamento: 'pago',
                    valorPago: cobrancas[2].valor,
                    valorPendente: 0,
                    pagamentos: [pagamento3.id]
                })

                // Emitir nota fiscal
                const notaFiscal2 = NotaFiscalService.emitirNotaFiscal({
                    cobrancaId: cobrancas[2].id,
                    pagamentoId: pagamento3.id,
                    clienteId: cobrancas[2].cliente,
                    valorServico: cobrancas[2].valor,
                    descricaoServico: cobrancas[2].descricao,
                    tipoServico: 'desenvolvimento',
                    regime: 'lucro_presumido'
                })

                // Associar nota fiscal à cobrança
                CobrancaService.atualizarCobranca(cobrancas[2].id, {
                    notaFiscal: notaFiscal2.id
                })
            }

            console.log('✅ Dados de teste de pagamentos e notas fiscais inicializados!')
            console.log(`💰 ${PagamentoService.pegarPagamentos().length} pagamentos criados`)
            console.log(`📄 ${NotaFiscalService.pegarNotasFiscais().length} notas fiscais emitidas`)
            
            // Log das estatísticas
            const estatisticasPagamentos = PagamentoService.obterEstatisticasPagamentos()
            const estatisticasNotas = NotaFiscalService.obterEstatisticasNotasFiscais()
            
            console.log('📊 Estatísticas de Pagamentos:', estatisticasPagamentos)
            console.log('📊 Estatísticas de Notas Fiscais:', estatisticasNotas)
        }
    }
}

export const demonstrarFuncionalidades = () => {
    console.log('\n=== DEMONSTRAÇÃO DAS NOVAS FUNCIONALIDADES ===')
    
    // Demonstrar formas de pagamento
    console.log('\n💳 FORMAS DE PAGAMENTO DISPONÍVEIS:')
    const formasPagamento = [
        { tipo: 'dinheiro', nome: '💰 Dinheiro', taxa: '0%' },
        { tipo: 'pix', nome: '📱 PIX', taxa: '0%' },
        { tipo: 'cartao_debito', nome: '💳 Cartão de Débito', taxa: '1,5%' },
        { tipo: 'cartao_credito', nome: '💳 Cartão de Crédito', taxa: '3,5%' },
        { tipo: 'boleto', nome: '📄 Boleto Bancário', taxa: '2,5%' },
        { tipo: 'transferencia', nome: '🏦 Transferência Bancária', taxa: '0%' }
    ]
    
    formasPagamento.forEach(forma => {
        console.log(`  ${forma.nome} - Taxa: ${forma.taxa}`)
    })

    // Demonstrar identificadores de pagamento
    console.log('\n🔢 IDENTIFICADORES DE PAGAMENTO:')
    const pagamentos = PagamentoService.pegarPagamentos()
    pagamentos.forEach(pagamento => {
        console.log(`  ${pagamento.formatarIdentificador?.()} - ${pagamento.formaPagamento} - R$ ${pagamento.valor.toFixed(2)}`)
    })

    // Demonstrar diretrizes fiscais
    console.log('\n📋 DIRETRIZES FISCAIS:')
    const diretrizes = [
        '✅ Emitir NF até 5 dias após prestação do serviço',
        '✅ Recolher impostos até dia 20 do mês seguinte',
        '✅ Manter documentos por 5 anos (digital)',
        '✅ Cancelamento possível até 24h após emissão',
        '✅ Backup mensal dos documentos fiscais'
    ]
    
    diretrizes.forEach(diretriz => {
        console.log(`  ${diretriz}`)
    })

    // Demonstrar tipos de serviço para NF
    console.log('\n🛠️ TIPOS DE SERVIÇO PARA NOTA FISCAL:')
    const tiposServico = [
        { codigo: '17.23', nome: 'Consultoria Empresarial' },
        { codigo: '01.07', nome: 'Desenvolvimento de Software' },
        { codigo: '13.05', nome: 'Design e Criação' },
        { codigo: '01.08', nome: 'Manutenção e Suporte' },
        { codigo: '08.01', nome: 'Treinamento e Capacitação' },
        { codigo: '17.06', nome: 'Marketing Digital' }
    ]
    
    tiposServico.forEach(tipo => {
        console.log(`  ${tipo.codigo} - ${tipo.nome}`)
    })

    // Demonstrar regimes tributários
    console.log('\n🏛️ REGIMES TRIBUTÁRIOS:')
    console.log('  📊 Simples Nacional - Alíquota unificada de 6% a 19%')
    console.log('  📊 Lucro Presumido - Múltiplos impostos (ISS, INSS, IR, PIS, COFINS)')
    console.log('  📊 Lucro Real - Baseado no lucro efetivo da empresa')

    console.log('\n=== FIM DA DEMONSTRAÇÃO ===\n')
}