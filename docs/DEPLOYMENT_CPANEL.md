# Deploy no cPanel com GitHub Actions

Este projeto pode ser hospedado como app estatico em um subdominio, por exemplo:

```text
https://app.seudominio.com
```

## Modelo Recomendado

O GitHub fica como fonte do codigo.

Ao fazer push na branch `main`:

1. GitHub Actions instala dependencias com `npm ci`.
2. Gera o build com `npm run build`.
3. Envia apenas o conteudo de `dist/` para o diretorio publico do subdominio no cPanel.

## Preparar o cPanel

1. Crie o subdominio no cPanel, por exemplo `app.seudominio.com`.
2. Configure o document root, por exemplo:

```text
/home/USUARIO_CPANEL/public_html/app
```

3. Ative SSL/HTTPS para o subdominio.
4. Confirme se sua hospedagem permite acesso SSH.

## Secrets no GitHub

No GitHub, va em:

```text
Repository > Settings > Secrets and variables > Actions
```

Crie estes secrets:

```text
CPANEL_HOST=seudominio.com
CPANEL_USER=usuario_cpanel
CPANEL_SSH_PORT=22
CPANEL_DEPLOY_PATH=/home/usuario_cpanel/public_html/app
CPANEL_SSH_PRIVATE_KEY=conteudo_da_chave_privada
```

Crie estas variables, se precisar:

```text
VITE_APP_NAME=Casa Clara
VITE_APP_AUTHOR=Rafael Varela
VITE_APP_DESCRIPTION=Controle Financeiro para Casais
VITE_BASE_PATH=/
```

Se o app for publicado em subpasta, ajuste:

```text
VITE_BASE_PATH=/casa-clara/
```

Para subdominio na raiz, deixe:

```text
VITE_BASE_PATH=/
```

## Criar Chave SSH

Na sua maquina:

```bash
ssh-keygen -t ed25519 -C "github-actions-casa-clara"
```

Adicione a chave publica no cPanel em:

```text
cPanel > SSH Access > Manage SSH Keys
```

O conteudo da chave privada entra no secret `CPANEL_SSH_PRIVATE_KEY`.

## Workflow

O arquivo da pipeline fica em:

```text
.github/workflows/deploy-cpanel.yml
```

Ele faz deploy com `rsync --delete`, entao o servidor fica espelhado com o build atual.

## Segurança do Deploy

- Nunca coloque senha, token, chave SSH ou dados reais no repositorio.
- Use GitHub Secrets para dados sensiveis.
- Use HTTPS no subdominio.
- Suba para o cPanel apenas o conteudo de `dist/`.
- O arquivo `.env` local nao deve ir para o GitHub.
- O arquivo `.env.example` pode ir para o GitHub.

