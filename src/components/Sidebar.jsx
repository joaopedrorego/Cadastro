import { Home, Trello, Tag, Users } from 'lucide-react'

const Sidebar = ({ activeTab, onTabChange }) => {
    const menuItems = [
        { id: 'home', icon: Home, label: 'Página inicial' },
        { id: 'extrato', icon: Trello, label: 'Extrato' },
        { id: 'cobrancas', icon: Tag, label: 'Cobranças' },
        { id: 'clientes', icon: Users, label: 'Clientes' }
    ]

    return (
        <aside className="app__navegacao">
            <nav>
                <ul>
                    {menuItems.map((item) => {
                        const IconComponent = item.icon
                        return (
                            <li key={item.id}>
                                <button 
                                    className={activeTab === item.id ? 'active' : ''}
                                    onClick={() => onTabChange(item.id)}
                                >
                                    <IconComponent size={20} />
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar