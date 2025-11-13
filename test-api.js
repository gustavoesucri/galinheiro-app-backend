#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configurações
const COLLECTION_PATH = path.join(__dirname, 'postman', 'galinheiro-api.postman_collection.json');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, 'test-results');

// Capturar saída do console
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
let consoleOutput = [];

// Override console methods to capture output
console.log = function(...args) {
  const message = args.join(' ');
  consoleOutput.push(message);
  originalConsoleLog.apply(console, args);
};

console.error = function(...args) {
  const message = args.join(' ');
  consoleOutput.push(`ERROR: ${message}`);
  originalConsoleError.apply(console, args);
};

// Cores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logRequest(name, method, url) {
  log(`\n🔄 Executando: ${name}`, 'cyan');
  log(`   ${method} ${url}`, 'yellow');
}

function logResponse(status, data, duration) {
  const color = status >= 200 && status < 300 ? 'green' : 'red';
  log(`   Status: ${status} (${duration}ms)`, color);

  if (data && typeof data === 'object') {
    log(`   Response: ${JSON.stringify(data, null, 2)}`, 'white');
  } else if (data) {
    log(`   Response: ${data}`, 'white');
  }
}

function logError(error) {
  log(`   ❌ Error: ${error.message}`, 'red');
  if (error.response) {
    log(`   Status: ${error.response.status}`, 'red');
    if (error.response.data) {
      log(`   Response: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
    }
  }
}

// Substituir variáveis no Postman
function replaceVariables(text, variables) {
  if (!text) return text;

  let result = text;
  variables.forEach(variable => {
    const regex = new RegExp(`{{${variable.key}}}`, 'g');
    result = result.replace(regex, variable.value);
  });

  return result;
}

// Construir URL completa
function buildUrl(urlObj, variables) {
  if (!urlObj) return '';

  const host = replaceVariables(urlObj.host?.join('') || '', variables);
  const path = urlObj.path ? urlObj.path.map(p => replaceVariables(p, variables)).join('/') : '';

  return `${host}/${path}`.replace(/\/+/g, '/');
}

// Preparar diretório de output
function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

// Salvar resultados em JSON
function saveResultsToFile(results) {
  ensureOutputDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `api-test-results-${timestamp}.json`;
  const filepath = path.join(OUTPUT_DIR, filename);

  const output = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    collection: results.collection,
    variables: results.variables,
    summary: results.summary,
    requests: results.requests
  };

  fs.writeFileSync(filepath, JSON.stringify(output, null, 2), 'utf8');
  return filepath;
}

// Salvar saída do console
function saveConsoleOutputToFile() {
  ensureOutputDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `api-test-console-${timestamp}.log`;
  const filepath = path.join(OUTPUT_DIR, filename);

  const consoleContent = consoleOutput.join('\n');
  fs.writeFileSync(filepath, consoleContent, 'utf8');
  return filepath;
}

// Salvar log legível
function saveLogToFile(results) {
  ensureOutputDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `api-test-log-${timestamp}.txt`;
  const filepath = path.join(OUTPUT_DIR, filename);

  let logContent = `API TEST RESULTS\n`;
  logContent += `================\n\n`;
  logContent += `Timestamp: ${new Date().toISOString()}\n`;
  logContent += `Base URL: ${BASE_URL}\n`;
  logContent += `Collection: ${results.collection}\n\n`;

  logContent += `VARIABLES USED:\n`;
  results.variables.forEach(v => {
    logContent += `  ${v.key}: ${v.value}\n`;
  });
  logContent += `\n`;

  logContent += `SUMMARY:\n`;
  logContent += `  Total Requests: ${results.summary.total}\n`;
  logContent += `  Successful: ${results.summary.successful}\n`;
  logContent += `  Failed: ${results.summary.failed}\n\n`;

  logContent += `DETAILED RESULTS:\n`;
  logContent += `=================\n\n`;

  results.requests.forEach(req => {
    logContent += `🔄 ${req.name}\n`;
    logContent += `   ${req.method} ${req.url}\n`;
    logContent += `   Status: ${req.status} (${req.duration}ms)\n`;

    if (req.success) {
      logContent += `   ✅ SUCCESS\n`;
    } else {
      logContent += `   ❌ FAILED\n`;
      if (req.error) {
        logContent += `   Error: ${req.error}\n`;
      }
    }

    if (req.response && typeof req.response === 'object') {
      logContent += `   Response: ${JSON.stringify(req.response, null, 2)}\n`;
    } else if (req.response) {
      logContent += `   Response: ${req.response}\n`;
    }

    logContent += `\n`;
  });

  fs.writeFileSync(filepath, logContent, 'utf8');
  return filepath;
}

// Executar uma requisição
async function executeRequest(request, variables) {
  const method = request.method;
  const url = buildUrl(request.url, variables);
  const headers = {};

  // Adicionar headers
  if (request.header) {
    request.header.forEach(h => {
      headers[h.key] = h.value;
    });
  }

  // Preparar body
  let data = null;
  if (request.body && request.body.mode === 'raw' && request.body.raw) {
    data = JSON.parse(replaceVariables(request.body.raw, variables));
  }

  const startTime = Date.now();

  try {
    const response = await axios({
      method,
      url,
      headers,
      data,
      timeout: 10000
    });

    const duration = Date.now() - startTime;
    logResponse(response.status, response.data, duration);

    return { success: true, status: response.status, data: response.data, duration };
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(error);
    return { success: false, error: error.message, status: error.response?.status, response: error.response?.data, duration };
  }
}

// Executar todos os testes
async function runTests() {
  try {
    // Ler collection
    const collectionData = fs.readFileSync(COLLECTION_PATH, 'utf8');
    const collection = JSON.parse(collectionData);

    log('🚀 Iniciando testes da API Galinheiro', 'magenta');
    log(`📍 Base URL: ${BASE_URL}`, 'blue');
    log(`📄 Collection: ${collection.info.name}`, 'blue');
    log('═'.repeat(50), 'cyan');

    // Preparar variáveis
    let variables = [
      { key: 'baseUrl', value: BASE_URL },
      { key: 'galinhaId', value: '00000000-0000-0000-0000-000000000101' },
      { key: 'galpaoId', value: '00000000-0000-0000-0000-000000000201' },
      { key: 'ninhoId', value: '00000000-0000-0000-0000-000000000301' },
      { key: 'ovoId', value: '00000000-0000-0000-0000-000000000401' },
      { key: 'medicaoId', value: '00000000-0000-0000-0000-000000000501' }
    ];

    // Tentar obter IDs reais do banco para testes mais realistas
    log('🔍 Obtendo IDs reais do banco de dados...', 'yellow');
    try {
      const galinhasResponse = await axios.get(`${BASE_URL}/galinhas`);
      if (galinhasResponse.data && galinhasResponse.data.length > 0) {
        variables.find(v => v.key === 'galinhaId').value = galinhasResponse.data[0].id;
        log(`   ✅ Usando galinhaId real: ${galinhasResponse.data[0].id}`, 'green');
      }

      const galpoesResponse = await axios.get(`${BASE_URL}/galpoes`);
      if (galpoesResponse.data && galpoesResponse.data.length > 0) {
        variables.find(v => v.key === 'galpaoId').value = galpoesResponse.data[0].id;
        log(`   ✅ Usando galpaoId real: ${galpoesResponse.data[0].id}`, 'green');
      }
    } catch (error) {
      log('   ⚠️  Não foi possível obter IDs reais, usando IDs padrão', 'yellow');
    }

    // Estatísticas e resultados
    let totalRequests = 0;
    let successfulRequests = 0;
    let failedRequests = 0;
    const requestResults = [];

    // Executar requests por grupo
    for (const group of collection.item) {
      log(`\n📁 Grupo: ${group.name}`, 'magenta');

      if (group.item) {
        for (const item of group.item) {
          totalRequests++;
          const requestUrl = buildUrl(item.request.url, variables);
          logRequest(item.name, item.request.method, requestUrl);

          const result = await executeRequest(item.request, variables);

          // Armazenar resultado para arquivo
          requestResults.push({
            group: group.name,
            name: item.name,
            method: item.request.method,
            url: requestUrl,
            success: result.success,
            status: result.status,
            duration: result.duration,
            error: result.error,
            response: result.response || result.data
          });

          if (result.success) {
            successfulRequests++;
          } else {
            failedRequests++;
          }

          // Pequena pausa entre requests
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }

    // Preparar dados para salvar
    const testResults = {
      collection: collection.info.name,
      variables: variables,
      summary: {
        total: totalRequests,
        successful: successfulRequests,
        failed: failedRequests
      },
      requests: requestResults
    };

    // Salvar resultados em arquivos
    const jsonFile = saveResultsToFile(testResults);
    const logFile = saveLogToFile(testResults);
    const consoleFile = saveConsoleOutputToFile();

    log('\n' + '═'.repeat(50), 'cyan');
    log('📊 RESULTADO DOS TESTES', 'magenta');
    log(`   Total de requests: ${totalRequests}`, 'white');
    log(`   ✅ Sucessos: ${successfulRequests}`, 'green');
    log(`   ❌ Falhas: ${failedRequests}`, 'red');
    log(`\n💾 Resultados salvos em:`, 'blue');
    log(`   📄 JSON: ${jsonFile}`, 'blue');
    log(`   📝 Log estruturado: ${logFile}`, 'blue');
    log(`   🖥️  Console output: ${consoleFile}`, 'blue');

    if (failedRequests === 0) {
      log('\n🎉 Todos os testes passaram!', 'green');
    } else {
      log(`\n⚠️  ${failedRequests} teste(s) falharam.`, 'yellow');
      log('💡 Dica: Alguns testes podem falhar por validações de negócio (nomes duplicados, IDs inexistentes)', 'cyan');
    }

  } catch (error) {
    log(`❌ Erro ao executar testes: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Verificar se a API está rodando
async function checkApiHealth() {
  try {
    log('🔍 Verificando se a API está rodando...', 'yellow');
    const response = await axios.get(`${BASE_URL}/`, { timeout: 5000 });
    log('✅ API está respondendo!', 'green');
    return true;
  } catch (error) {
    log('❌ API não está respondendo. Certifique-se de que o backend está rodando.', 'red');
    log(`   Erro: ${error.message}`, 'red');
    return false;
  }
}

// Função principal
async function main() {
  const apiHealthy = await checkApiHealth();
  if (!apiHealthy) {
    process.exit(1);
  }

  await runTests();
}

main();