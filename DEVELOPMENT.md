# PontuaFlow Web - Guia de Desenvolvimento

## Estrutura Criada

```
src/
├── main.ts              # Ponto de entrada da aplicação
├── app.module.ts        # Módulo principal
├── app.controller.ts    # Controlador principal

views/
├── layouts/
│   └── layout.ejs       # Layout principal único
├── pages/
│   ├── projects.ejs     # Listagem de projetos
│   ├── home.ejs         # Painel principal do projeto
│   ├── devs.ejs         # Aba de desenvolvedores
│   ├── tasks.ejs        # Aba de tarefas
│   ├── metrics.ejs      # Aba de métricas
│   └── settings.ejs     # Aba de configurações
└── partials/
    ├── header.ejs       # Cabeçalho
    ├── navbar.ejs       # Abas de navegação
    └── footer.ejs       # Rodapé

public/images/          # Pasta para imagens

package.json            # Dependências do projeto
tsconfig.json           # Configuração TypeScript
nest-cli.json           # Configuração NestJS CLI
.env.example            # Exemplo de variáveis de ambiente
.gitignore              # Arquivo de exclusão Git
```

## Próximos Passos

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados
- Copiar `.env.example` para `.env`
- Configurar variáveis PostgreSQL

### 3. Criar Entidades TypeORM
- Definir modelos para: Project, Dev, Week, Task, etc.
- Implementar migrations

### 4. Implementar Serviços
- ProjectService
- DevService
- TaskService
- MetricsService

### 5. Implementar Controladores
- ProjectController
- DevController
- TaskController
- MetricsController

### 6. Implementar Lógica nas Views
- Conectar modais aos endpoints
- Implementar filtros e paginação
- Adicionar validações client-side

## Stack Tecnológico

- **Frontend**: HTML5, CSS3, JavaScript, jQuery, Bootstrap 5
- **Backend**: NestJS, TypeScript
- **Renderização**: EJS (Server-side)
- **Banco de Dados**: PostgreSQL + TypeORM
- **Gerenciamento de Dependências**: npm

## Executar em Desenvolvimento

```bash
npm run start:dev
```

A aplicação estará disponível em `http://localhost:3000`

## Build para Produção

```bash
npm run build
npm run start:prod
```

## Observações

- Não há autenticação nesta versão
- O projeto é o contexto principal de navegação
- Bootstrap e jQuery carregam via CDN
- CSS e JavaScript estão inline nas views EJS
- Imagens devem ser colocadas na pasta `public/images/`
