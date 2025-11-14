# Captura de Requisições e Respostas

Este documento descreve como funciona o mecanismo de captura de requisições (do frontend) e respostas (do backend) que foi adicionado ao projeto.

> Observação: Os `console.log`/`console.error` relacionados à escrita dos arquivos foram deixados no código conforme solicitado — você verá mensagens no terminal quando um arquivo for gravado.

---

## O que foi adicionado

1. Middleware que salva os corpos JSON enviados pelo frontend em arquivos.
   - Arquivo: `src/common/middleware/request-capture.middleware.ts`
   - Captura métodos: `POST`, `PUT`, `PATCH`, `DELETE` (quando `Content-Type: application/json`).
   - Salva um arquivo por requisição em `captured/front/`.

2. Interceptor global que salva o corpo de resposta em arquivos.
   - Arquivo: `src/common/interceptors/response-capture.interceptor.ts`
   - Salva um arquivo por resposta em `captured/back/`.

3. Registro no `main.ts` para habilitar os dois componentes.
   - `app.use(requestCaptureMiddleware);`
   - `app.useGlobalInterceptors(new ResponseCaptureInterceptor());`

---

## Onde os arquivos são salvos

- Requisições (enviadas pelo front):
  - `<project-root>/captured/front/` — um arquivo `.json` por requisição.
- Respostas (devolvidas pelo backend):
  - `<project-root>/captured/back/` — um arquivo `.json` por resposta.

Os nomes dos arquivos contêm timestamp, método, caminho e um sufixo randômico, por exemplo:

```
1699871234567-POST-galinhas-ab12cd.json
```

---

## Formato dos arquivos

Exemplo de arquivo de requisição (`captured/front/...`):

```json
{
  "timestamp": "2025-11-13T12:34:56.789Z",
  "method": "POST",
  "path": "/galinhas",
  "headers": { "content-type": "application/json", ... },
  "body": { "nome": "Galinha Teste", "idade": 2 }
}
```

Exemplo de arquivo de resposta (`captured/back/...`):

```json
{
  "timestamp": "2025-11-13T12:34:56.812Z",
  "method": "POST",
  "path": "/galinhas",
  "statusCode": 201,
  "durationMs": 23,
  "response": { "id": "...", "nome": "Galinha Teste" }
}
```

---

## Como testar localmente

1. Inicie o backend (modo desenvolvimento recomendável para reload automático):

```bash
cd galinheiro-app-backend
npm run start:dev
```

2. Execute uma requisição JSON qualquer a partir do frontend ou usando `curl`/Postman. Exemplo com `curl`:

```bash
curl -X POST http://localhost:3000/galinhas \
  -H "Content-Type: application/json" \
  -d '{"nome":"Galinha Teste","idade":2}'
```

3. Confira os arquivos salvos:

```bash
ls -l captured/front
ls -l captured/back
```

4. Abra os arquivos `.json` gerados para inspecionar os corpos enviados e recebidos.

---

## Opções e alterações possíveis

Se preferir outro comportamento, posso alterar o código para qualquer uma das opções abaixo:

1. Limitar a captura apenas a rotas específicas (ex.: apenas `/galinhas` e `/ovos`).
2. Salvar por recurso (um arquivo por recurso com todos os objetos appendados) em vez de um arquivo por requisição.
3. Usar escrita assíncrona (`fs.promises`) e um worker para descarregar I/O do fluxo principal.
4. Implementar rotação e retenção (ex.: manter arquivos apenas por `N` dias e apagar os mais antigos automaticamente).
5. Adicionar tamanho máximo por arquivo / ignorar payloads acima de X bytes para evitar arquivos enormes.
6. Adicionar logging estruturado ou enviar os eventos de captura a um destino externo (Elastic, S3, etc.).

---

## Observações de segurança e operação

- Não deixe esse mecanismo ativado em produção sem revisão de privacidade: os arquivos podem conter dados sensíveis (tokens, PII). Considere mascarar ou remover campos sensíveis antes de gravar.
- Os `console.log`/`console.error` de gravação de arquivo foram mantidos conforme solicitado — você verá mensagens no terminal quando um arquivo for gravado ou quando ocorrer falha na escrita.
- Escrita atualmente é síncrona para garantir que a gravação aconteça imediatamente; isso simplifica debug mas pode impactar performance sob alto volume. Posso mudar para assíncrono sob demanda.

---

## Como desabilitar rapidamente

Se quiser voltar ao comportamento anterior (sem capturas), comente ou remova estas linhas em `src/main.ts` e reinicie o servidor:

```ts
// app.use(requestCaptureMiddleware);
// app.useGlobalInterceptors(new ResponseCaptureInterceptor());
```

---

## Próximos passos sugeridos (rápidos)

- Se você quer capturar apenas os JSON que vêm do app (e não de ferramentas/ops), me diga quais rotas filtrar.
- Se prefere consolidar por recurso, digo como e aplico a mudança.
- Se quiser, adiciono um endpoint `GET /debug/captured` protegido (por IP ou token) que lista os arquivos recentes para consulta rápida.

---

Se quiser que eu aplique qualquer uma das opções acima, diga qual (por exemplo: "A: limitar a `/galinhas` e `/ovos`" ou "B: salvar por recurso com append").
