# Publicação imediata: GitHub + Vercel + Supabase

Arquitetura de produção:

- GitHub Actions executa lint e build em pull requests e pushes para `master`.
- A integração oficial da Vercel publica automaticamente cada atualização da `master`.
- Supabase fornece autenticação e banco PostgreSQL.

## Primeiro deploy

1. Envie o código atualizado para o GitHub.
2. Entre em [vercel.com](https://vercel.com) usando a conta do GitHub.
3. Clique em **Add New > Project**.
4. Importe `RafaelMoid/CasaClara`.
5. Confirme:

```text
Framework Preset: Vite
Production Branch: master
Build Command: npm run build
Output Directory: dist
Install Command: npm ci
```

6. Antes de clicar em Deploy, cadastre em **Environment Variables**:

```text
VITE_APP_NAME=Casa Clara
VITE_APP_AUTHOR=Rafael Varela
VITE_APP_DESCRIPTION=Controle Financeiro para Casais
VITE_BASE_PATH=/
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA
```

Marque Production, Preview e Development. Nunca use a chave `service_role` no frontend.

7. Clique em **Deploy**.

O arquivo `vercel.json` configura Vite, a pasta `dist` e o fallback das rotas React para `index.html`.

## Configurar o Supabase

Depois de receber a URL `https://seu-projeto.vercel.app`, abra:

```text
Supabase > Authentication > URL Configuration
```

Configure:

```text
Site URL: https://seu-projeto.vercel.app
Redirect URLs:
https://seu-projeto.vercel.app/**
http://localhost:5173/**
```

Isso habilita confirmação de cadastro e recuperação de senha na produção.

## Atualizações futuras

Cada push ou merge na `master` inicia automaticamente um novo deploy da Vercel. O workflow `.github/workflows/ci-cd.yml` também executa lint e build no GitHub.

Fluxo recomendado:

```bash
git switch -c feature/minha-alteracao
git add .
git commit -m "Descrição da alteração"
git push -u origin feature/minha-alteracao
```

Abra um pull request e faça merge para `master` após o CI passar.
