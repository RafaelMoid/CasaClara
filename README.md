# Casa Clara

Casa Clara e uma aplicacao web PWA, mobile first, para controle financeiro de casais. O projeto foi criado com foco em estudo de React, JavaScript moderno e boas praticas de organizacao de uma SPA real.

## Stack

- React 18 para criar a interface com componentes.
- Vite para desenvolvimento rapido e build de producao.
- JavaScript ES6+ como linguagem principal.
- Tailwind CSS para estilizar com classes utilitarias.
- React Router DOM para navegacao entre telas.
- Supabase para autenticacao, banco online e politicas de seguranca.
- Recharts para graficos de barras e pizza.
- lucide-react para icones.
- PWA com `manifest.json` e `service worker`.

## Como Rodar

```bash
npm install
npm run dev
```

Build de producao:

```bash
npm run build
npm run preview
```

No Windows, se `npm` for bloqueado pelo PowerShell, use:

```bash
npm.cmd install
npm.cmd run dev
```

## Variaveis de Ambiente

O projeto usa Vite, entao variaveis expostas ao frontend precisam comecar com `VITE_`.

Crie seu ambiente local copiando o exemplo:

```bash
copy .env.example .env
```

Principais variaveis:

```text
VITE_APP_NAME=Casa Clara
VITE_APP_AUTHOR=Rafael Varela
VITE_APP_DESCRIPTION=Controle Financeiro para Casais
VITE_BASE_PATH=/
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Use `VITE_BASE_PATH=/` quando publicar na raiz do dominio.

Use uma subpasta quando publicar dentro de um diretorio:

```text
VITE_BASE_PATH=/casa-clara/
```

Importante: nunca coloque senhas, tokens ou chaves privadas em variaveis `VITE_`, porque elas entram no bundle final do navegador.

Use apenas a `anon public key` do Supabase no frontend. Nunca use a `service_role key` no React.

## Fluxo do App

Na primeira execucao, o usuario passa por:

1. Onboarding com apresentacao do Casa Clara.
2. Termos de Uso com checkbox obrigatorio.
3. Criacao da conta do casal com nome, moeda e idioma.
4. Acesso ao dashboard e funcionalidades principais.

As rotas internas ficam protegidas ate o usuario aceitar os termos e concluir a configuracao inicial.

## Funcionalidades

- Dashboard com receitas, despesas, saldo, grafico de barras, grafico de pizza e ultimas transacoes.
- Transacoes com cadastro, edicao, exclusao e filtros.
- Orcamentos com nome, categoria, limite e responsavel dentro da familia.
- Metas financeiras com valor alvo, valor atual e data.
- Contas com saldo atual.
- Relatorios por periodo com exportacao CSV.
- Configuracoes com perfil, moeda, idioma, tema claro/escuro, backup e restauracao.
- Usuarios, familias, troca de usuario ativo, troca de familia ativa e convites locais.
- Dados financeiros salvos no Supabase por familia autenticada.

## Modelo de Usuarios e Familias

O app trabalha com um modelo local/offline e sincronizacao online via Supabase:

- Um `user` representa uma pessoa.
- Uma `family` representa um grupo financeiro.
- Uma pessoa pode participar de mais de uma familia por meio de `memberships`.
- O membro principal da familia tem role `owner`.
- Convites ficam em `invitations` e podem ser aceitos por usuarios autenticados.
- O app guarda `activeUserId` e `activeFamilyId` para saber quem esta usando e qual familia esta ativa.
- Os dados financeiros ficam no Supabase em `app_snapshots`.
- O navegador mantem apenas estado temporario em memoria durante o uso da tela.

O Supabase usa Row Level Security para limitar os dados por familia.

## Estrutura de Pastas

```text
casa-clara/
├── public/
│   ├── icons/
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── components/
│   ├── contexts/
│   ├── data/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Arquivos Importantes

- `src/main.jsx`: ponto de entrada do React. Renderiza o app, configura Router, Context e registra o service worker.
- `src/App.jsx`: define as rotas e protege o acesso ao app.
- `src/contexts/FinanceContext.jsx`: centraliza estado, funcoes de CRUD e persistencia local.
- `src/data/seed.js`: dados iniciais, categorias e formas de pagamento.
- `src/data/i18n.js`: textos para pt, en, es e it.
- `src/utils/finance.js`: funcoes puras para calcular totais e dados de graficos.
- `src/utils/formatters.js`: formatacao de moeda, data, IDs e exportacao CSV.

## Fundamentos de React Para Estudar

### Componentes

Cada tela e cada bloco reutilizavel foi separado em componentes. Exemplos:

- `PageHeader`
- `StatCard`
- `TransactionItem`
- `AppLayout`

Estude como props entram nesses componentes e mudam o resultado visual.

### State

O app usa `useState` em formularios, filtros e estados locais de tela.

Exemplo de estudo:

- Como o formulario de transacao atualiza cada campo.
- Como filtros alteram a lista exibida.
- Como o checkbox dos termos libera o botao continuar.

### Context API

O `FinanceContext` evita passar props por muitas camadas. Ele entrega para o app:

- dados globais;
- perfil;
- transacoes;
- contas;
- orcamentos;
- metas;
- funcoes como `addTransaction`, `updateProfile` e `restoreData`.

### Effects

O `useEffect` carrega o snapshot do Supabase quando o app inicia e salva novamente sempre que o estado muda.

### Memoizacao

O app usa `useMemo` para evitar recalcular filtros e valores derivados sem necessidade.

## Fundamentos de JavaScript Para Estudar

- Arrays com `map`, `filter`, `reduce` e `find`.
- Objetos com spread operator: `{ ...form, name: value }`.
- Funcoes puras em `utils/finance.js`.
- Datas com `Date`.
- Formatacao com `Intl.NumberFormat` e `Intl.DateTimeFormat`.
- Promises no carregamento e sincronizacao com Supabase.
- Manipulacao de arquivos com `Blob`, `URL.createObjectURL` e `FileReader`.

## PWA e Offline

O arquivo `public/manifest.json` permite que o app seja instalavel.

O arquivo `public/sw.js` cria um cache simples dos arquivos da aplicacao. Dados financeiros nao sao persistidos no navegador; eles sao salvos no Supabase quando o usuario esta autenticado.

## Publicar no GitHub com Seguranca

Antes de subir para o GitHub, confira:

- `node_modules/` nao deve ser enviado.
- `dist/` nao deve ser enviado, a menos que voce queira publicar manualmente o build.
- `.env` nao deve ser enviado.
- backups reais, dados financeiros reais e arquivos `.json` de backup nao devem ser enviados.
- `.env.example` deve ser enviado, pois ele mostra como configurar o projeto sem expor dados sensiveis.

Comandos sugeridos:

```bash
git init
git add .
git commit -m "Initial Casa Clara project"
git branch -M main
git remote add origin https://github.com/seu-usuario/casa-clara.git
git push -u origin main
```

Se o repositorio ja existir localmente, use apenas:

```bash
git add .
git commit -m "Prepare project for GitHub and deployment"
git push
```

## Publicar Na Vercel Com Supabase

Este e o caminho recomendado para colocar o Casa Clara online com seguranca, sem mexer no `public_html` do site principal:

```text
docs/VERCEL_SUPABASE_MIGRATION.md
```

Resumo:

- crie o projeto no Supabase;
- execute `supabase/schema.sql`;
- configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`;
- publique o frontend na Vercel;
- use um subdominio como `casaclara.rafaelvarela.com.br`.

## Publicar Manualmente Em Servidor Estatico

Para publicar como site estatico:

```bash
npm run build
```

Depois envie o conteudo da pasta `dist/` para a pasta publica do servidor, por exemplo:

- `public_html/`, se for publicar na raiz do dominio.
- `public_html/casa-clara/`, se for publicar em subpasta.

Se publicar em subpasta, ajuste antes o `.env`:

```text
VITE_BASE_PATH=/casa-clara/
```

Depois rode novamente:

```bash
npm run build
```

O arquivo `public/.htaccess` sera copiado para `dist/` e ajuda servidores Apache/cPanel a redirecionarem rotas internas da SPA para `index.html`.

Este caminho nao e mais recomendado para o Casa Clara online com login, mas continua possivel para testes estaticos. Para publicar manualmente em `rafaelvarela.com.br/casaclara`, veja:

```text
docs/CPANEL_MANUAL_UPLOAD.md
```

## Pipeline e Login Online

Os documentos de cPanel ficaram como legado do experimento anterior:

```text
docs/DEPLOYMENT_CPANEL.md
docs/CPANEL_MANUAL_UPLOAD.md
```

Para entender o plano de seguranca e evolucao do login:

```text
docs/AUTH_SECURITY_PLAN.md
```

Importante: login seguro nao deve ser feito apenas no frontend. A versao online precisa de backend, banco de dados e sessoes seguras.

## Roteiro de Apresentacao em Ingles

Use este roteiro para apresentar o projeto:

```text
Hello, my name is Rafael Varela.
This project is called Casa Clara.
It is a mobile-first PWA built with React, Vite, Tailwind CSS and JavaScript.

The goal of the app is to help couples manage their finances together.
Users can track income, expenses, budgets, goals, accounts and reports.

The first flow includes onboarding, terms of use and the couple account setup.
After that, the user can access the dashboard.

The app uses React Router for navigation, Context API for global state,
Supabase for online persistence, Recharts for charts
and lucide-react for icons.

All data is stored locally, so the app can work offline.
I also implemented a light and dark theme, language settings and CSV export.

This project helped me practice React components, props, state, hooks,
forms, routes, array methods, local storage and responsive UI.
```

## Technical Vocabulary

- Component: componente
- Props: dados passados para um componente
- State: estado interno ou global
- Hook: funcao especial do React
- Route: rota de navegacao
- Form: formulario
- Filter: filtro
- Chart: grafico
- Local persistence: persistencia local
- Supabase: plataforma usada para Auth e banco online
- Service worker: script que ajuda o app a funcionar offline
- Responsive design: design responsivo
- Mobile first: pensado primeiro para celular

## Sugestao de Estudo

1. Rode o app e navegue por todas as telas.
2. Leia `src/App.jsx` para entender as rotas.
3. Leia `FinanceContext.jsx` para entender estado global.
4. Leia uma tela simples, como `Accounts.jsx`.
5. Leia uma tela com formulario, como `TransactionForm.jsx`.
6. Leia `Dashboard.jsx` para entender graficos e dados derivados.
7. Altere categorias ou dados iniciais em `seed.js`.
8. Adicione uma nova funcionalidade pequena, como excluir metas.

## Sobre

Desenvolvido por Rafael Varela.

Os dados inseridos no Casa Clara podem ser usados para os mais diversos fins. Este app e gratuito, mas podemos tornar alguns recursos pagos no futuro. Ao usar, voce concorda com nossos Termos de Uso e Politica de Privacidade.
