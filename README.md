<div align="center">
  <h2 align="center">PontuaFlow Web</h2>
    <p align="center">
        Aplicação web para controle e pontuação de desenvolvedores em projetos (UI + servidor de renderização com EJS).
    </p>
</div>

<div align="center">
    <a href="https://nodejs.org/">
        <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node-badge">
    </a>
    <a href="https://nestjs.com/">
        <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="Nest-badge">
    </a>
    <a href="https://ejs.co/">
        <img src="https://img.shields.io/badge/EJS-2B2B2B?style=for-the-badge&logo=ejs&logoColor=white" alt="EJS-badge">
    </a>
    <a href="https://getbootstrap.com/">
        <img src="https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap-badge">
    </a>
</div>

<br>

<div align="center">
    <a href="#sobre-o-projeto">Sobre</a> &#xa0; • &#xa0;
    <a href="#instalacao">Instalação</a> &#xa0; • &#xa0;
    <a href="#guia-de-integração">Integração</a> &#xa0; • &#xa0;
    <a href="#autor">Autor</a> &#xa0;
</div>

---

## Sobre o projeto

O **PontuaFlow Web** é a interface web do sistema PontuaFlow. Serve como UI e camada de renderização (EJS) para gerenciar projetos, semanas, desenvolvedores, tarefas e métricas de pontuação (gamification).

O backend de persistência e API pode ser a **[PontuaFlow API](https://github.com/juletopi/PontuaFlowAPI)** (.NET) ou outra API compatível; o frontend consome essa API através da variável `API_URL` presente no arquivo de ambiente.

### Principais funcionalidades

- Listagem e criação de Projetos
- Cadastro de Desenvolvedores (Devs)
- Registro de Tarefas por Semana
- Visualização de Métricas e Ranking por projeto
- Modal para criação rápida e navegação centralizada via layout

<div align="left">
  <h6><a href="#pontuaflow-web"> Voltar para o início ↺</a></h6>
</div>

## Instalação

> [!IMPORTANT]
> Certifique-se de ter os seguintes requisitos antes de iniciar:
>
> <a href="https://nodejs.org/">
>    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node-badge">
> </a>
> <a href="https://www.npmjs.com/">
>    <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm-badge">
> </a>

1. Instale dependências

```bash
npm install
```

2. Crie um arquivo `.env` baseado em `.env.example` e configure `API_URL` apontando para a sua API (ex: `http://localhost:8080/api`).

3. Execute em modo de desenvolvimento

```bash
npx ts-node src/main.ts
# ou
npm run start:dev
```

O servidor ficará disponível em `http://localhost:3000` por padrão.

<div align="left">
  <h6><a href="#pontuadev"> Voltar para o início ↺</a></h6>
</div>

## Guia de Integração

O frontend comunica-se com a API através da variável `API_URL` (exposta no servidor via variáveis de ambiente para uso em scripts). Fluxo típico:

1. Subir a **[PontuaFlow API](https://github.com/juletopi/PontuaFlowAPI)** (ex: .NET 8) ou sua implementação preferida.
2. Ajustar `API_URL` em `.env` para apontar para a API (ex: `API_URL=http://localhost:8080/api`).
3. Formular chamadas `fetch`/`axios` do frontend para `API_URL` nos pontos necessários (criar projetos, devs, tarefas, etc.).

Exemplo com fetch:

```javascript
fetch(`${API_URL}/devs`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Maria', projectId })
});
```

### Observações

- Habilite CORS na API para permitir requisições do `http://localhost:3000` (se API estiver em domínio/porta diferentes).
- O layout centraliza header, navbar, título e breadcrumb — as páginas só devem prover o corpo do conteúdo.

<div align="left">
  <h6><a href="#pontuaflow-web"> Voltar para o início ↺</a></h6>
</div>

## Autor

<table>
  <tr>
    <td valign="middle" width="25%">
      <div align="center">  
        <a href="https://github.com/juletopi" title="Perfil no GitHub" aria-label="GitHub - Juletopi">
          <img src="https://avatars.githubusercontent.com/u/76459155?s=400&u=4b9bd87cae92eea4fc154c28eafe226ed034a1d8&v=4" width="150" alt="Profile Pic - Juletopi"/>
          <br>
          <sub><strong>Júlio Cézar | Juletopi</strong></sub>
          <br>
        </a>
      </div>
    </td>
    <td valign="middle" width="75%">
      <ul style="list-style: none; padding-left: 0; margin: 0;">
        <li>
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" width="15" alt="LinkedIn" style="vertical-align:middle;">
          LinkedIn — 
          <a href="https://www.linkedin.com/in/julio-cezar-pereira-camargo/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn - Júlio Cézar P. Camargo">
            Júlio Cézar P. Camargo
          </a>
        </li>
        <li>
          <img src="https://pngimg.com/uploads/email/email_PNG100738.png" width="15" alt="Email" style="vertical-align:middle;">
          Email — 
          <a href="mailto:juliocezarpvh@hotmail.com" aria-label="Send email - juliocezarpvh@hotmail.com">
            juliocezarpvh@hotmail.com
          </a>
        </li>
        <li>
          <img src="https://cdn3.emoji.gg/emojis/2116-facebook.png" width="15" alt="Facebook" style="vertical-align:middle;">
          Facebook — 
          <a href="https://www.facebook.com/juhletopi" target="_blank" rel="noopener noreferrer" aria-label="Facebook - Juhletopi">
            facebook.com/juhletopi
          </a>
        </li>
        <li>
          <img src="https://cdn3.emoji.gg/emojis/6333-instagram.png" width="15" alt="Instagram" style="vertical-align:middle;">
          Instagram — 
          <a href="https://www.instagram.com/juletopi/" target="_blank" rel="noopener noreferrer" aria-label="Instagram - Juletopi">
            @juletopi
          </a>
        </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <img src="https://github.com/user-attachments/assets/a3e6ca25-6035-4a7a-94b9-f35cb9d24a96" width="18" alt="Portfolio" align="center"/>
      Portfolio —
      <a href="https://juletopi.github.io/JCPC_Portfolio/" target="_blank" rel="noopener noreferrer" aria-label="Portfolio - Juletopi">
        juletopi.github.io/JCPC_Portfolio
      </a>
    </td>
  </tr>
</table>

<div align="left">
  <h6><a href="#pontuaflow-web"> Voltar para o início ↺</a></h6>
</div>

<br>

----

<div align="center">
  Feito com ❤️ e ☕ por <a href="https://github.com/juletopi"> Juletopi</a>.
</div>