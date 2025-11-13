# API Testing Script

Este script executa todos os testes da API usando a collection do Postman.

## Como usar

### Pré-requisitos
- Backend rodando em `http://localhost:3000` (ou configure via `BASE_URL`)
- Node.js instalado

### Executar os testes

```bash
# Usando npm script (recomendado)
npm run test:api

# Ou diretamente
node test-api.js

# Ou com URL customizada
BASE_URL=http://localhost:3001 node test-api.js
```

## O que o script faz

1. **Verificação de saúde**: Testa se a API está rodando
2. **Leitura da collection**: Carrega `postman/galinheiro-api.postman_collection.json`
3. **IDs dinâmicos**: Busca IDs reais do banco para testes mais realistas
4. **Execução completa**: Roda todos os 27 requests da collection
5. **Captura de output**: Salva toda a saída do console em arquivo
6. **Relatórios detalhados**: Gera 3 tipos de arquivo:
   - **JSON estruturado**: Dados completos para processamento
   - **Log legível**: Relatório formatado para leitura humana
   - **Console output**: Exata saída do terminal com cores
7. **Estatísticas**: Mostra contadores de sucesso/falha

## Arquivos gerados

O script cria automaticamente uma pasta `test-results/` com 3 arquivos:

### 📄 `api-test-results-{timestamp}.json`
Arquivo JSON estruturado contendo:
- Timestamp da execução
- URL base utilizada
- Variáveis substituídas
- Estatísticas resumidas
- Resultado detalhado de cada request (status, duração, response/error)

### 📝 `api-test-log-{timestamp}.txt`
Log legível em texto puro com:
- Cabeçalho com informações da execução
- Variáveis utilizadas
- Estatísticas resumidas
- Resultados detalhados formatados

### 🖥️ `api-test-console-{timestamp}.log`
Captura exata da saída do console incluindo:
- Todas as mensagens coloridas
- Emojis e formatação visual
- Mesma aparência do terminal
- Útil para debugging visual

## Grupos de teste

- **Health & Dashboard**: Endpoints básicos e dashboard
- **Galinhas**: CRUD completo de galinhas
- **Galpões**: CRUD completo de galpões
- **Ninhos**: CRUD completo de ninhos
- **Ovos**: CRUD completo de ovos
- **Medições de Ambiente**: CRUD completo de medições

## Variáveis configuráveis

| Variável | Valor padrão | Descrição |
|----------|-------------|-----------|
| `BASE_URL` | `http://localhost:3000` | URL base da API |
| `galinhaId` | `00000000-0000-0000-0000-000000000101` | ID de exemplo para galinha |
| `galpaoId` | `00000000-0000-0000-0000-000000000201` | ID de exemplo para galpão |
| `ninhoId` | `00000000-0000-0000-0000-000000000301` | ID de exemplo para ninho |
| `ovoId` | `00000000-0000-0000-0000-000000000401` | ID de exemplo para ovo |
| `medicaoId` | `00000000-0000-0000-0000-000000000501` | ID de exemplo para medição |

## Exemplo de output

```
🚀 Iniciando testes da API Galinheiro
📍 Base URL: http://localhost:3000
📄 Collection: Galinheiro API
══════════════════════════════════════════════════
🔍 Obtendo IDs reais do banco de dados...
   ✅ Usando galinhaId real: 24daa078-87b9-452c-aa29-d3e177beba2a
   ✅ Usando galpaoId real: f8e80497-9b3f-4d20-86d9-b96490a70309

📁 Grupo: Health & Dashboard
🔄 Executando: GET Root
   GET http://localhost:3000/
   Status: 200 (2ms)
   Response: Hello World!

[...execução de todos os testes...]

══════════════════════════════════════════════════
📊 RESULTADO DOS TESTES
   Total de requests: 27
   ✅ Sucessos: 14
   ❌ Falhas: 13

💾 Resultados salvos em:
   📄 JSON: /path/to/test-results/api-test-results-2025-11-13T23-33-22-177Z.json
   📝 Log estruturado: /path/to/test-results/api-test-log-2025-11-13T23-33-22-178Z.txt
   🖥️  Console output: /path/to/test-results/api-test-console-2025-11-13T23-33-22-178Z.log

⚠️  13 teste(s) falharam.
💡 Dica: Alguns testes podem falhar por validações de negócio (nomes duplicados, IDs inexistentes)
```

## Debugging com os arquivos salvos

### 🖥️ Console Output (`.log`)
- **Quando usar**: Para ver exatamente o que apareceu no terminal
- **Vantagens**: Preserva cores, emojis e formatação visual
- **Uso**: Abrir em editor que suporte ANSI colors ou no terminal com `cat arquivo.log`

### 📝 Log Estruturado (`.txt`)
- **Quando usar**: Para análise rápida de resultados
- **Vantagens**: Fácil de ler, bem formatado, contém todas as informações essenciais
- **Uso**: Abrir em qualquer editor de texto

### 📄 JSON Estruturado (`.json`)
- **Quando usar**: Para processamento automatizado ou análise detalhada
- **Vantagens**: Dados estruturados, fácil de parsear, contém responses completas
- **Uso**: Importar em ferramentas de análise, scripts, ou visualizar com formatadores JSON

### Exemplo de análise de falhas

```bash
# Ver apenas falhas no log estruturado
grep -A 10 "❌ FAILED" test-results/api-test-log-*.txt

# Contar tipos de erro no JSON
cat test-results/api-test-results-*.json | jq '.requests[] | select(.success == false) | .status' | sort | uniq -c

# Ver responses de erro detalhadas
cat test-results/api-test-results-*.json | jq '.requests[] | select(.success == false) | {name: .name, status: .status, error: .error, response: .response}'
```

## Personalização

Para modificar os dados de teste, edite:
- `postman/galinheiro-api.postman_collection.json` - Collection do Postman
- `test-api.js` - Lógica do script de teste