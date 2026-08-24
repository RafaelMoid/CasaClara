# Estado da hospedagem cPanel — Casa Clara

Última atualização: 24 de agosto de 2026.

Este documento registra onde paramos na preparação da hospedagem do Casa Clara. Ao retomar o assunto, consulte este arquivo antes de alterar pipelines, DNS ou configurações de produção.

## 1. Estado atual

- O projeto funciona localmente como aplicação React/Vite.
- O código está no GitHub, no repositório `RafaelMoid/CasaClara`.
- A branch de produção pretendida é `master`.
- O backend já utilizado pelo aplicativo é o Supabase.
- O Supabase cuida de autenticação, recuperação de senha, banco PostgreSQL e RLS.
- O frontend ainda não possui uma hospedagem de produção confirmada.
- Foi preparada no repositório uma pipeline para Vercel, mas ela ainda não foi configurada com credenciais nem executada em produção.
- A decisão mais recente é avaliar o uso da hospedagem cPanel existente em vez da Vercel.
- O provedor respondeu à análise técnica do cPanel; os dados recebidos estão registrados na seção 4.
- Nenhuma senha de FTP foi recebida ou cadastrada.
- Nenhum deploy para cPanel foi realizado nesta etapa.

## 2. Arquitetura desejada caso o cPanel seja aprovado

```text
push ou merge na master
          ↓
GitHub Actions
npm ci → lint → build
          ↓
SSH + rsync, preferencialmente
          ↓
cPanel — frontend React/Vite estático
          ↓
Supabase — autenticação e banco de dados
```

O cPanel hospedará somente os arquivos estáticos gerados na pasta `dist/`. Não é necessário executar Node.js permanentemente no servidor.

## 3. Decisão recomendada de domínio

Preferência atual:

```text
casaclara.seudominio.com
```

Um subdomínio dedicado é preferível a uma subpasta porque permite:

- `VITE_BASE_PATH=/`;
- rotas React mais simples;
- configuração mais segura do service worker;
- configuração mais simples do PWA;
- URLs mais claras para cadastro e recuperação de senha;
- separação do site principal existente.

Se o provedor não permitir subdomínio, a alternativa será publicar em uma subpasta, por exemplo:

```text
https://seudominio.com/casaclara/
```

Nesse caso, o build deverá usar:

```text
VITE_BASE_PATH=/casaclara/
```

## 4. Resposta recebida do provedor

Resposta recebida em 24 de agosto de 2026:

1. **SSH externo:** indisponível.
2. **Terminal:** disponível exclusivamente dentro do painel cPanel.
3. **SSH/rsync pelo GitHub Actions:** inviável no plano atual porque não existe endpoint SSH externo.
4. **Caminho público do domínio principal:** `/home/escolhieconomize/public_html/`.
5. **Subdomínio:** permitido.
6. **Diretório do subdomínio:** será definido durante a criação e ficará dentro de `public_html`.
7. **SSL:** gratuito para domínios e subdomínios que utilizem os servidores DNS da hospedagem.
8. **Servidor web:** Apache.
9. **`.htaccess` e `mod_rewrite`:** permitidos.
10. **Recomendação do provedor:** utilizar o recurso `Git™ Version Control` do cPanel.
11. **FTP disponível:** sim.
12. **Host FTP:** `escolhieconomizei.com.br`.
13. **Porta FTP:** `21`.
14. **Usuário FTP informado:** `escolhieconomize`.

Observação: o provedor informou FTP na porta 21, mas não confirmou se o servidor aceita **FTPS explícito com TLS**. Essa confirmação é necessária antes de armazenar uma credencial de deploy no GitHub.

Documentação indicada pelo provedor: [Git Version Control do cPanel](https://docs.cpanel.net/cpanel/files/git-version-control/).

## 5. Diagnóstico após a resposta

### O que está aprovado

- O frontend pode ser hospedado no cPanel.
- Um subdomínio dedicado pode ser criado.
- HTTPS gratuito está disponível.
- React Router poderá usar `.htaccess` e `mod_rewrite`.
- O Supabase pode continuar como backend sem mudanças de arquitetura.

### O que foi descartado

- Deploy automático por SSH.
- Deploy automático por `rsync`.
- Uso de chave SSH do GitHub Actions para acessar diretamente o servidor.

### Limitação do Git Version Control do cPanel

O cPanel consegue clonar o repositório e executar tarefas descritas em `.cpanel.yml`. Entretanto, sem acesso externo ou uma integração adicional, as ações **Update from Remote** e **Deploy HEAD Commit** são normalmente iniciadas pelo painel. Isso não garante sozinho o requisito de publicar automaticamente a cada push na `master`.

Além disso, ainda é necessário confirmar se o servidor cPanel possui Node.js/npm adequados caso o build seja feito nele. A estratégia preferida continua sendo gerar `dist/` no GitHub Actions e enviar somente o resultado compilado.

### Caminho recomendado neste momento

1. Criar o subdomínio do Casa Clara.
2. Confirmar o diretório público exato criado para ele.
3. Confirmar com o provedor se o FTP da porta 21 aceita FTPS explícito/TLS.
4. Se FTPS estiver disponível, adaptar o GitHub Actions para build e deploy FTPS.
5. Se existir apenas FTP sem criptografia, não armazenar a senha no GitHub antes de avaliar uma alternativa segura.

## 6. Cenários possíveis

### Cenário A — SSH e rsync disponíveis

Este é o cenário recomendado.

A pipeline fará build no GitHub e enviará `dist/` por `rsync`. O servidor poderá ser espelhado com segurança para remover assets antigos após cada publicação.

Secrets previstos no GitHub:

```text
CPANEL_HOST
CPANEL_USER
CPANEL_SSH_PORT
CPANEL_DEPLOY_PATH
CPANEL_SSH_PRIVATE_KEY
```

### Cenário B — SSH disponível, mas sem rsync

Será avaliado o envio por SFTP ou SCP. A pipeline continuará possível, mas a limpeza de arquivos antigos exigirá mais cuidado.

### Cenário C — somente SFTP ou FTPS

Será criada uma pipeline usando o protocolo oferecido pelo provedor. Precisaremos confirmar host, porta, usuário, diretório remoto e política de conexões.

**Situação atual:** este é o cenário provável, mas FTPS ainda não foi confirmado.

### Cenário D — somente FTP sem TLS

Não é recomendado para credenciais de produção. Antes de prosseguir, deve-se pedir SFTP ou FTPS ao provedor.

**Situação atual:** pode ser este cenário se a hospedagem não oferecer TLS na conexão FTP da porta 21.

### Cenário E — sem automação externa permitida

O cPanel não será adequado para o CI/CD desejado. Nesse caso, a Vercel volta a ser a opção preferencial para o frontend.

## 7. Pipeline existente no repositório

Atualmente há uma nova pipeline preparada para Vercel:

```text
.github/workflows/ci-cd.yml
```

Também existe:

```text
vercel.json
docs/GITHUB_VERCEL_DEPLOYMENT.md
```

O workflow legado de cPanel foi removido durante a preparação da Vercel, mas seu histórico continua disponível no Git.

Quando o provedor responder, será necessário escolher somente um destino de produção:

- adaptar `ci-cd.yml` para cPanel e retirar as etapas da Vercel; ou
- permanecer na Vercel e não criar uma segunda pipeline de produção.

Não manter dois deploys de produção ativos para o mesmo push.

## 8. Configurações que a pipeline cPanel precisará receber

Além dos dados de conexão, o build precisa destas variáveis:

```text
VITE_APP_NAME=Casa Clara
VITE_APP_AUTHOR=Rafael Varela
VITE_APP_DESCRIPTION=Controle Financeiro para Casais
VITE_BASE_PATH=/
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA
```

As variáveis poderão ser cadastradas como GitHub Actions secrets ou variables. Nunca utilizar a chave `service_role` do Supabase no frontend.

## 9. Configuração necessária no Supabase após o deploy

Quando a URL de produção existir, abrir:

```text
Supabase → Authentication → URL Configuration
```

Configurar:

```text
Site URL: https://casaclara.seudominio.com

Redirect URLs:
https://casaclara.seudominio.com/**
http://localhost:5173/**
```

Isso é necessário para confirmação de cadastro e redefinição de senha.

## 10. Requisitos do servidor web

Para uma SPA React com `BrowserRouter`, o servidor deve devolver `index.html` quando uma rota não corresponder a um arquivo real.

No Apache/cPanel isso será feito com `.htaccess` e `mod_rewrite`. Antes do deploy, verificar se o arquivo atual em `public/` atende ao domínio ou subpasta escolhida.

Também será necessário confirmar:

- HTTPS funcionando antes de ativar redirects obrigatórios;
- MIME types corretos para JavaScript, CSS, manifesto e service worker;
- cache adequado para assets com hash;
- `index.html` sem cache excessivamente longo;
- service worker servido na mesma origem e no escopo correto.

## 11. Próximas perguntas ao provedor

Enviar estas perguntas complementares:

> Obrigado pelas informações. Para finalizar a automação de deploy, poderiam confirmar:
>
> 1. O serviço FTP em `escolhieconomizei.com.br`, porta 21, aceita FTPS explícito com TLS?
> 2. O modo passivo de FTP/FTPS está habilitado para conexões originadas pelo GitHub Actions?
> 3. Após a criação do subdomínio, qual será o caminho FTP relativo até a pasta pública dele?
> 4. O recurso Git Version Control consegue atualizar e executar o deploy automaticamente ao receber um push do GitHub, sem clicar em “Update from Remote” e “Deploy HEAD Commit” no cPanel?
> 5. Existe webhook, Deployment API, UAPI ou token de API do cPanel disponível externamente para disparar essas duas ações?
> 6. O Terminal do cPanel possui Node.js 22 e npm disponíveis? Esta informação é apenas para avaliar o `.cpanel.yml`; a preferência é compilar no GitHub Actions.

Não enviar a senha de FTP por e-mail ou registrá-la neste documento.

## 12. O que fazer após a próxima resposta

1. Abrir este documento.
2. Colar na conversa a nova resposta do provedor, removendo senhas e dados sensíveis.
3. Classificar a resposta em um dos cenários da seção 6.
4. Confirmar domínio ou subdomínio final.
5. Confirmar o diretório remoto exato.
6. Criar a chave SSH de deploy, se aplicável.
7. Cadastrar somente a chave pública no cPanel.
8. Cadastrar a chave privada nos secrets do GitHub.
9. Adaptar `.github/workflows/ci-cd.yml` para o protocolo aprovado.
10. Ajustar `VITE_BASE_PATH`.
11. Revisar `.htaccess`, PWA e service worker.
12. Executar lint e build.
13. Realizar um primeiro deploy controlado.
14. Testar rotas, login, logout e recuperação de senha.
15. Atualizar URLs do Supabase.
16. Registrar neste documento o domínio publicado e a data do primeiro deploy.

## 13. Critérios para considerar a hospedagem concluída

- Pipeline da `master` aprovada no GitHub Actions.
- Deploy automático executado sem senha interativa.
- Aplicação acessível por HTTPS.
- Atualização direta de rotas sem erro 404.
- Login Supabase funcionando.
- Recuperação de senha retornando à URL de produção.
- PWA instalável.
- Service worker atualizado.
- Novo push na `master` refletido automaticamente no site.
- Nenhum secret presente no repositório ou nos logs públicos.

## 14. Próximo marco

**Aguardando a confirmação de FTPS/TLS, modo passivo, diretório do subdomínio e possibilidade real de disparo automático pelo Git Version Control do cPanel.**

Até essa resposta chegar, não alterar a pipeline de produção para cPanel e não cadastrar senha FTP no GitHub.
