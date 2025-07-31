# Sistema de Controle de Cobranças - Kenzie

## 📋 Descrição

Sistema web para controle de cobranças e clientes, desenvolvido com HTML, CSS e JavaScript vanilla. Permite cadastrar clientes, emitir cobranças e visualizar o status das transações.

## ✨ Melhorias Implementadas

### 🐛 Correções de Erros
- **HTML**: Corrigido erro de digitação no atributo `name` do input
- **JavaScript**: Removido código de teste desnecessário do arquivo `db.js`
- **Interface**: Melhorada a lógica de fechamento de popups
- **Validação**: Adicionados atributos `required` nos formulários

### 📱 Responsividade
- **Mobile First**: Design totalmente responsivo
- **Menu Mobile**: Navegação lateral com toggle para dispositivos móveis
- **Breakpoints**: Otimizado para tablets (768px) e smartphones (480px)
- **Layout Adaptativo**: Grid e flexbox se adaptam ao tamanho da tela

### 🎨 Melhorias Visuais
- **Design System**: Implementado sistema de cores e variáveis CSS
- **Tipografia**: Melhorada hierarquia visual com fontes Open Sans e Righteous
- **Sombras e Bordas**: Adicionados efeitos modernos com border-radius e box-shadow
- **Animações**: Transições suaves e animações de entrada
- **Estados**: Hover effects e feedback visual para interações

### 🔧 Funcionalidades Adicionadas
- **Menu Mobile**: Toggle para navegação em dispositivos móveis
- **Fechamento com ESC**: Popups podem ser fechados com a tecla Escape
- **Dados de Exemplo**: Sistema carrega dados de demonstração automaticamente
- **Navegação Ativa**: Indicação visual do item de menu selecionado
- **Validação de Formulários**: Campos obrigatórios e validação HTML5

## 🚀 Como Usar

1. **Abra o arquivo `index.html`** em um navegador moderno
2. **Navegue pelo menu lateral** para acessar as funcionalidades
3. **Clique em "Clientes"** para cadastrar novos clientes
4. **Clique em "Cobranças"** para emitir novas cobranças
5. **Use a busca** para filtrar cobranças por nome do cliente

## 📱 Responsividade

### Desktop (>1024px)
- Layout completo com navegação lateral fixa
- Grid de cobranças com todas as colunas visíveis

### Tablet (768px - 1024px)
- Navegação lateral reduzida
- Grid adaptado para telas médias

### Mobile (<768px)
- Menu hambúrguer para navegação
- Layout em coluna única
- Cards de cobranças empilhados
- Popups em tela cheia

## 🎯 Funcionalidades

### Clientes
- ✅ Cadastro de clientes com nome, CPF e telefone
- ✅ Validação de campos obrigatórios
- ✅ Armazenamento local (localStorage)

### Cobranças
- ✅ Emissão de cobranças com descrição e valor
- ✅ Seleção de cliente cadastrado
- ✅ Status de pagamento (paga/pendente)
- ✅ Data de emissão automática

### Interface
- ✅ Busca de cobranças por nome do cliente
- ✅ Visualização em lista com status
- ✅ Popups modais para cadastros
- ✅ Navegação intuitiva

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com variáveis CSS
- **JavaScript ES6+**: Funcionalidades dinâmicas
- **Feather Icons**: Ícones vetoriais
- **Google Fonts**: Tipografia Open Sans e Righteous

## 📁 Estrutura do Projeto

```
├── index.html              # Página principal
├── public/
│   └── style.css          # Estilos CSS
├── src/
│   ├── app.js             # Arquivo principal
│   ├── controllers/       # Controladores
│   │   ├── Cliente.js
│   │   ├── Cobranca.js
│   │   └── interface.js
│   ├── models/           # Modelos de dados
│   │   ├── Cliente.js
│   │   ├── Cobranca.js
│   │   └── Quadro.js
│   └── db/               # Banco de dados local
│       └── db.js
└── README.md
```

## 🔄 Melhorias Futuras

- [ ] Implementar filtros avançados
- [ ] Adicionar exportação de relatórios
- [ ] Implementar sistema de notificações
- [ ] Adicionar gráficos e dashboards
- [ ] Implementar autenticação de usuários
- [ ] Adicionar backup em nuvem

## 📝 Licença

Este projeto foi desenvolvido como parte do curso da Kenzie Academy Brasil.

---

**Desenvolvido com ❤️ para controle eficiente de cobranças**