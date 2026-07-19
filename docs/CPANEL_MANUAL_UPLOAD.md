# Publicacao Manual no cPanel

Use este caminho quando voce nao quiser usar pipeline do GitHub.

URL desejada:

```text
https://rafaelvarela.com.br/casaclara/
```

## 1. Gerar build local

No terminal, dentro do projeto:

```bash
npm run build -- --mode cpanel
```

No Windows, se necessario:

```bash
npm.cmd run build -- --mode cpanel
```

Ou use o script pronto:

```bash
npm run build:cpanel
```

Isso gera a pasta:

```text
dist/
```

## 2. Criar pasta no cPanel

No cPanel:

```text
File Manager > public_html
```

Crie a pasta:

```text
casaclara
```

O caminho ficara parecido com:

```text
public_html/casaclara
```

## 3. Fazer upload

Envie todo o conteudo de `dist/` para:

```text
public_html/casaclara
```

Importante: envie o conteudo da pasta `dist`, nao a pasta `dist` inteira.

Exemplo correto:

```text
public_html/casaclara/index.html
public_html/casaclara/assets/
public_html/casaclara/icons/
public_html/casaclara/manifest.json
public_html/casaclara/sw.js
public_html/casaclara/.htaccess
```

## 4. Acessar

Abra:

```text
https://rafaelvarela.com.br/casaclara/
```

## Observacao sobre login seguro

Para ativar login seguro, publique tambem a pasta `api/` em:

```text
public_html/casaclara/api
```

Depois crie o banco MySQL no cPanel, importe:

```text
database/schema.sql
```

Copie:

```text
api/config/config.example.php
```

para:

```text
api/config/config.php
```

e preencha os dados reais do banco. O arquivo `config.php` nao deve ir para o GitHub.

Estrutura esperada no servidor:

```text
public_html/casaclara/index.html
public_html/casaclara/assets/
public_html/casaclara/api/index.php
public_html/casaclara/api/bootstrap.php
public_html/casaclara/api/config/config.php
```

A pasta `api/config/` possui `.htaccess` para bloquear acesso direto aos arquivos de configuracao.

Se o HTTPS do dominio estiver com timeout, nao force redirect para HTTPS no `.htaccess` do app. Primeiro resolva o SSL/porta 443 no cPanel ou com a hospedagem. Depois disso, o redirect para HTTPS pode ser reativado.

No build de producao, use:

```text
VITE_API_URL=/casaclara/api
```
