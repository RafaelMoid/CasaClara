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

Esta publicacao coloca o frontend no ar.

Para login real com dados salvos com seguranca, ainda sera necessario implementar backend e banco de dados no servidor.
