# Login Seguro e Dados no Servidor

Nota: este documento registra o plano anterior baseado em cPanel/PHP. A estrategia atual recomendada do projeto e Vercel + Supabase, descrita em `docs/VERCEL_SUPABASE_MIGRATION.md`.

O app atual e uma PWA com dados online no Supabase. O estado financeiro fica em memoria no React durante o uso da tela e e salvo no banco remoto.

Para login seguro online, o projeto precisa de um backend.

## Arquitetura Recomendada para cPanel

Como voce ja possui cPanel, uma arquitetura realista e:

```text
React PWA
  |
  | HTTPS
  v
API PHP no mesmo subdominio
  |
  v
MySQL do cPanel
```

Exemplo:

```text
https://app.seudominio.com
https://app.seudominio.com/api
```

## O Que Deve Ficar no Backend

- Cadastro de usuario.
- Login.
- Logout.
- Sessao segura.
- Familias.
- Membros.
- Convites.
- Transacoes.
- Orcamentos.
- Metas.
- Contas.

## Como Salvar Senhas

Senhas nunca devem ser salvas em texto puro.

Use:

- `password_hash()` no PHP.
- `password_verify()` no PHP.
- Algoritmo atual do PHP, como bcrypt/Argon2 quando disponivel.

## Sessao Segura

Preferir cookie de sessao:

- `HttpOnly`
- `Secure`
- `SameSite=Lax` ou `SameSite=Strict`
- expiracao definida

Evite salvar token sensivel em `localStorage`.

## Banco de Dados Inicial

Tabelas sugeridas:

```text
users
families
family_members
family_invitations
accounts
transactions
budgets
goals
sessions
```

## Regras de Permissao

- Usuario so pode ver dados das familias em que e membro.
- Apenas `owner` pode convidar membros.
- Uma pessoa pode participar de varias familias.
- Cada recurso financeiro deve ter `family_id`.
- Orcamentos podem ter `assigned_user_id`.

## Proximo Passo de Implementacao

Base implementada:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
GET  /api/families
POST /api/families
POST /api/families/invite
POST /api/invitations/accept
GET  /api/sync
PUT  /api/sync
```

O React usa Supabase quando `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estiverem configurados. Dados financeiros nao sao salvos no navegador.
