# Sistema de Cobranças Kenzie - React

Um sistema completo de gerenciamento de cobranças desenvolvido em React, baseado no sistema original em JavaScript vanilla.

## 🚀 Funcionalidades

### ✅ **Já Implementadas:**
- **Dashboard:** Visão geral com estatísticas de cobranças
- **Gestão de Clientes:** Cadastro, edição e gerenciamento de clientes
- **Gestão de Cobranças:** Criação, edição e controle de status de cobranças
- **Sistema de Busca:** Filtrar cobranças por cliente ou descrição
- **Persistência Local:** Dados salvos no localStorage do navegador
- **Interface Moderna:** Design responsivo e acessível
- **Validação de Formulários:** Validação em tempo real com feedback visual

### 🎯 **Recursos Principais:**
- **Status de Cobranças:** Marcar como paga/pendente com um clique
- **Cálculos Automáticos:** Total arrecadado, pendente e estatísticas gerais
- **Formatação Automática:** CPF e valores monetários
- **Responsividade:** Interface adaptável para desktop e mobile
- **Modais Interativos:** Formulários em popups elegantes

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **Vite** - Build tool e dev server
- **Lucide React** - Ícones modernos
- **CSS Moderno** - Flexbox, Grid, e animações
- **JavaScript ES6+** - Classes, modules, async/await
- **LocalStorage API** - Persistência de dados

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Header.jsx      # Cabeçalho com saldo
│   ├── Sidebar.jsx     # Menu lateral
│   ├── Modal.jsx       # Modal reutilizável
│   ├── ClienteForm.jsx # Formulário de cliente
│   ├── CobrancaForm.jsx # Formulário de cobrança
│   ├── CobrancasList.jsx # Lista de cobranças
│   └── SearchBar.jsx   # Barra de pesquisa
├── hooks/              # React Hooks customizados
│   ├── useClientes.js  # Hook para gestão de clientes
│   └── useCobrancas.js # Hook para gestão de cobranças
├── services/           # Camada de serviços
│   ├── BancoDados.js   # Gerenciamento do localStorage
│   ├── ClienteService.js # Operações CRUD de clientes
│   └── CobrancaService.js # Operações CRUD de cobranças
├── models/             # Modelos de dados
│   ├── Cliente.js      # Classe Cliente
│   └── Cobranca.js     # Classe Cobrança
├── data/               # Dados iniciais
│   └── initialData.js  # Dados de teste
├── App.jsx             # Componente principal
├── App.css             # Estilos globais
└── main.jsx            # Ponto de entrada
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação
```bash
# Clonar o repositório
git clone <url-do-repositorio>

# Entrar na pasta do projeto
cd react-cobrancas

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build de produção
```

## 💡 Como Usar

### 1. **Dashboard**
- Acesse a página inicial para ver estatísticas gerais
- Visualize total de cobranças, valores pagos e pendentes

### 2. **Cadastrar Cliente**
- Clique em "Clientes" no menu lateral
- Clique em "Novo Cliente"
- Preencha os dados (nome, CPF, telefone)
- O CPF é formatado automaticamente

### 3. **Criar Cobrança**
- Clique em "Cobranças" no menu lateral
- Clique em "Nova Cobrança"
- Preencha descrição e valor
- Selecione o cliente
- A data é preenchida automaticamente

### 4. **Gerenciar Cobranças**
- Na lista de cobranças, clique no ícone ✓ para marcar como paga
- Use os ícones de editar/excluir para gerenciar
- Use a barra de pesquisa para filtrar

## 🎨 Design System

### Cores Principais
- **Primária:** Gradiente azul/roxo (#667eea → #764ba2)
- **Sucesso:** Verde (#059669)
- **Erro:** Vermelho (#ef4444)
- **Neutros:** Tons de cinza do Tailwind CSS

### Componentes
- **Buttons:** Primário e secundário com estados hover/disabled
- **Forms:** Validação visual com feedback em tempo real
- **Cards:** Sombras sutis e bordas arredondadas
- **Icons:** Lucide React para consistência

## 🔧 Arquitetura

### Padrões Utilizados
- **Component Pattern:** Componentes reutilizáveis e isolados
- **Custom Hooks:** Lógica de estado compartilhada
- **Service Layer:** Separação entre UI e lógica de negócio
- **Repository Pattern:** Abstração do acesso aos dados

### Gerenciamento de Estado
- **Local State:** useState para estado de componente
- **Custom Hooks:** useClientes e useCobrancas para estado global
- **Persistência:** localStorage com sincronização automática

### Validação e UX
- **Validação em Tempo Real:** Feedback imediato nos formulários
- **Formatação Automática:** CPF e valores monetários
- **Estados de Loading:** Feedback visual durante operações
- **Confirmações:** Modais de confirmação para ações destrutivas

## 🚧 Próximas Funcionalidades

- [ ] **Lista de Clientes:** Visualização completa com CRUD
- [ ] **Relatórios:** Exportação de dados em PDF/Excel
- [ ] **Dashboard Avançado:** Gráficos e métricas detalhadas
- [ ] **Filtros Avançados:** Por data, status, valor
- [ ] **Backup/Restore:** Import/export de dados
- [ ] **Notificações:** Sistema de alertas
- [ ] **Tema Escuro:** Alternância de temas
- [ ] **PWA:** Funcionalidades offline

## 🔄 Migração do Sistema Original

Este projeto é uma versão React do sistema original em JavaScript vanilla, mantendo:

✅ **Funcionalidades Preservadas:**
- Todas as operações CRUD
- Persistência no localStorage
- Validações de formulário
- Cálculos automáticos
- Interface similar

🚀 **Melhorias Adicionadas:**
- Componentes reutilizáveis
- Estado reativo
- Tipagem melhorada
- Performance otimizada
- UX mais fluida
- Código mais maintível

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido com ❤️ usando React e Vite**