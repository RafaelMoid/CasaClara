# Login Seguro e Dados no Servidor

O app atual e uma PWA com dados locais em IndexedDB. Isso e bom para estudo e uso offline, mas nao e suficiente para login real e dados compartilhados entre usuarios.

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

O React usa a API quando `VITE_API_URL` estiver configurado. Sem essa variavel, o app continua funcionando local/offline com IndexedDB.
