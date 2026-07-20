# Migracao Para Vercel + Supabase

Este caminho substitui o deploy em cPanel. A ideia e deixar o site principal `rafaelvarela.com.br` intocado e hospedar o Casa Clara em uma infraestrutura separada:

- Vercel: publica o frontend React/Vite.
- Supabase: cuida de login, banco PostgreSQL, Auth e Row Level Security.
- GitHub: guarda o codigo e permite deploy simples pela Vercel.

## 1. Limpar a Estrategia Antiga

No cPanel, mantenha removida a pasta que causou problema:

```text
public_html/casaclara
```

Nao suba mais arquivos do Casa Clara dentro do `public_html` do site principal. Isso evita conflito com `.htaccess`, SSL, PHP ou rotas do site atual.

## 2. Criar Projeto No Supabase

1. Acesse `https://supabase.com`.
2. Crie um novo projeto.
3. Escolha uma senha forte para o banco.
4. Aguarde o projeto terminar de provisionar.
5. Va em `Project Settings > API`.
6. Copie:
   - `Project URL`
   - `Publishable key` ou `anon public key`

Esses dois valores podem ir no frontend. Nunca use `service_role key` no React.

## 3. Criar As Tabelas

No Supabase:

1. Abra `SQL Editor`.
2. Crie uma nova query.
3. Copie o conteudo de:

```text
supabase/schema.sql
```

4. Execute a query.

Esse script cria:

- `profiles`
- `families`
- `family_members`
- `family_invitations`
- `app_snapshots`
- politicas de RLS para limitar acesso por familia.

## 4. Configurar Auth

No Supabase, va em:

```text
Authentication > URL Configuration
```

Durante desenvolvimento:

```text
Site URL: http://localhost:5173
Redirect URLs: http://localhost:5173/**
```

Depois que a Vercel gerar a URL final, adicione tambem:

```text
https://seu-projeto.vercel.app/**
```

Se usar subdominio proprio:

```text
https://casaclara.rafaelvarela.com.br/**
```

Para testar mais rapido, voce pode desativar temporariamente a confirmacao de e-mail em:

```text
Authentication > Providers > Email
```

Em producao, a confirmacao de e-mail e recomendada.

## 5. Configurar O Projeto Local

Crie um arquivo `.env` com:

```text
VITE_APP_NAME=Casa Clara
VITE_APP_AUTHOR=Rafael Varela
VITE_APP_DESCRIPTION=Controle Financeiro para Casais
VITE_BASE_PATH=/
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_PUBLISHABLE_KEY_OU_ANON_PUBLIC_KEY
```

Rode localmente:

```bash
npm.cmd install
npm.cmd run dev
```

Teste:

- cadastro;
- login;
- criacao da familia;
- transacoes;
- reload da pagina;
- logout/login novamente.

## 6. Publicar Na Vercel

1. Suba o projeto para o GitHub.
2. Acesse `https://vercel.com`.
3. Clique em `Add New > Project`.
4. Importe o repositorio `CasaClara`.
5. Configure:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

6. Em `Environment Variables`, adicione:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_BASE_PATH=/
```

7. Clique em `Deploy`.

## 7. Usar Subdominio

Recomendado:

```text
casaclara.rafaelvarela.com.br
```

Na Vercel:

1. Abra o projeto.
2. Va em `Settings > Domains`.
3. Adicione `casaclara.rafaelvarela.com.br`.
4. Siga a instrucao de DNS indicada pela Vercel.

Normalmente sera um registro:

```text
Tipo: CNAME
Nome: casaclara
Destino: cname.vercel-dns.com
```

No cPanel ou painel de DNS do dominio, crie esse CNAME. Isso nao mexe nos arquivos do site principal.

## 8. Como Os Dados Ficam Salvos

O app usa duas camadas:

- Estado em memoria no React enquanto a tela esta aberta.
- Supabase `app_snapshots`: fonte persistente dos dados da familia logada.

Quando o usuario esta logado, o app carrega o snapshot da familia e salva alteracoes no Supabase. Dados financeiros nao sao persistidos no navegador. O acesso e limitado por RLS: apenas membros daquela familia conseguem ler e alterar o snapshot.

## 9. O Que Ainda Podemos Melhorar

Esta migracao coloca o app online com login real e isolamento por familia. Para uma versao mais robusta, os proximos passos seriam:

- separar transacoes, contas, metas e orcamentos em tabelas proprias;
- criar tela de aceitar convite por link;
- adicionar recuperacao de senha;
- adicionar logs/auditoria de alteracoes financeiras;
- criptografar campos sensiveis antes de salvar, se o produto exigir privacidade mais forte.
