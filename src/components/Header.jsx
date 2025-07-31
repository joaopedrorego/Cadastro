import { DollarSign } from 'lucide-react'
import { useCobrancas } from '../hooks/useCobrancas'

const Header = () => {
    const { estatisticas } = useCobrancas()

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    return (
        <header className="header">
            <div className="app__logo">
                <h1>Kenzie Cobranças</h1>
            </div>
            <div className="app__saldo">
                <p>
                    <DollarSign size={20} />
                    <strong>Saldo Disponível</strong>
                </p>
                <span>{formatCurrency(estatisticas.pagas)}</span>
            </div>
        </header>
    )
}

export default Header