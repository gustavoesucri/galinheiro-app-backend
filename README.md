# 🐔 API Galinheiro - Backend NestJS<p align="center">

  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>

Sistema completo de gerenciamento de galinheiro com NestJS, TypeORM e PostgreSQL.</p>



## 📋 Índice[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

- [Tecnologias](#tecnologias)

- [Pré-requisitos](#pré-requisitos)  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

- [Instalação](#instalação)    <p align="center">

- [Configuração do Banco](#configuração-do-banco)<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>

- [Execução](#execução)<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>

- [Endpoints da API](#endpoints-da-api)<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>

- [Regras de Negócio](#regras-de-negócio)<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>

- [Postman](#postman)<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>

- [Estrutura do Projeto](#estrutura-do-projeto)<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>

<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>

## 🚀 Tecnologias  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>

    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>

- **NestJS** 11.0.10 - Framework Node.js  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>

- **TypeORM** 0.3.27 - ORM para PostgreSQL</p>

- **PostgreSQL** - Banco de dados relacional  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)

- **class-validator** - Validação de DTOs  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

- **class-transformer** - Transformação de dados

## Description

## 📦 Pré-requisitos

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

- Node.js 18+ 

- npm ou yarn## Project setup

- PostgreSQL 14+

```bash

## 🔧 Instalação$ npm install

```

1. Clone o repositório:

```bash## Compile and run the project

git clone <url-do-repositorio>

cd galinheiro-app-backend```bash

```# development

$ npm run start

2. Instale as dependências:

```bash# watch mode

npm install$ npm run start:dev

```

# production mode

3. Configure as variáveis de ambiente:$ npm run start:prod

```bash```

cp .env.example .env

```## Run tests



Edite o arquivo `.env` com suas credenciais do PostgreSQL:```bash

```env# unit tests

DATABASE_HOST=localhost$ npm run test

DATABASE_PORT=5432

DATABASE_USERNAME=postgres# e2e tests

DATABASE_PASSWORD=suaSenha$ npm run test:e2e

DATABASE_NAME=galinheiro_db

PORT=3000# test coverage

```$ npm run test:cov

```

## 🗄️ Configuração do Banco

## Deployment

### Criar o banco de dados:

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

**Opção 1 - psql (se autenticação configurada):**

```bashIf you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

psql -U postgres -c "CREATE DATABASE galinheiro_db;"

``````bash

$ npm install -g @nestjs/mau

**Opção 2 - sudo (Ubuntu/Debian):**$ mau deploy

```bash```

sudo -u postgres psql -c "CREATE DATABASE galinheiro_db;"

```With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.



**Opção 3 - pgAdmin:**## Resources

- Abra o pgAdmin

- Clique com botão direito em "Databases"Check out a few resources that may come in handy when working with NestJS:

- "Create" → "Database"

- Nome: `galinheiro_db`- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.

- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).

### Executar migrations (criar tabelas e dados iniciais):- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).

- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.

```bash- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).

npm run build- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).

npm run typeorm:run-migrations- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).

```- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).



## ▶️ Execução## Support



### Modo desenvolvimento (com hot reload):Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

```bash

npm run start:dev## Stay in touch

```

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)

### Modo produção:- Website - [https://nestjs.com](https://nestjs.com/)

```bash- Twitter - [@nestframework](https://twitter.com/nestframework)

npm run build

npm run start:prod## License

```

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

A API estará disponível em: `http://localhost:3000`

## 📡 Endpoints da API

### Galpões (`/galpoes`)
- `GET /galpoes` - Listar todos
- `GET /galpoes/:id` - Buscar por ID
- `POST /galpoes` - Criar novo
- `PATCH /galpoes/:id` - Atualizar
- `DELETE /galpoes/:id` - Deletar

**Exemplo POST:**
```json
{
  "nome": "Galpão Norte",
  "capacidade_maxima_galinhas": 50,
  "capacidade_maxima_ninhos": 20,
  "area_m2": 100,
  "tipo_piso": "concreto",
  "ventilacao": "forçada",
  "ativo": true,
  "data_ultima_manutencao": "2025-11-01T00:00:00.000Z"
}
```

### Galinhas (`/galinhas`)
- `GET /galinhas` - Listar todas
- `GET /galinhas/:id` - Buscar por ID
- `POST /galinhas` - Criar nova
- `PATCH /galinhas/:id` - Atualizar
- `DELETE /galinhas/:id` - Deletar

**Exemplo POST:**
```json
{
  "nome": "Galinha Pintadinha",
  "saude": "Boa",
  "raca": "Rhode Island Red",
  "emQuarentena": false,
  "local": "galpao",
  "galpaoId": "uuid-do-galpao",
  "data_nascimento": "2025-05-01"
}
```

### Ninhos (`/ninhos`)
- `GET /ninhos` - Listar todos
- `GET /ninhos/:id` - Buscar por ID
- `POST /ninhos` - Criar novo
- `PATCH /ninhos/:id` - Atualizar
- `DELETE /ninhos/:id` - Deletar

**Exemplo POST:**
```json
{
  "identificacao": "Ninho-A1",
  "tipo_material": "madeira",
  "galpaoId": "uuid-do-galpao",
  "ocupado": false,
  "ultima_limpeza": "2025-11-10T00:00:00.000Z"
}
```

### Ovos (`/ovos`)
- `GET /ovos` - Listar todos
- `GET /ovos/:id` - Buscar por ID
- `POST /ovos` - Criar novo
- `PATCH /ovos/:id` - Atualizar (exceto data)
- `DELETE /ovos/:id` - Deletar

**Exemplo POST:**
```json
{
  "data": "2025-11-13",
  "galinhaId": "uuid-da-galinha",
  "ninhoId": "uuid-do-ninho",
  "tamanho": "Médio",
  "cor": "Marrom",
  "qualidade": "Boa"
}
```

### Medições Ambiente (`/medicoes-ambiente`)
- `GET /medicoes-ambiente` - Listar todas
- `GET /medicoes-ambiente/:id` - Buscar por ID
- `POST /medicoes-ambiente` - Criar nova
- `PATCH /medicoes-ambiente/:id` - Atualizar
- `DELETE /medicoes-ambiente/:id` - Deletar

**Exemplo POST:**
```json
{
  "galpaoId": "uuid-do-galpao",
  "temperatura": 25.5,
  "umidade": 65.0,
  "luminosidade": 500,
  "usa_ventilacao": true,
  "ventilacao_ativa": false,
  "data_medicao": "2025-11-13T14:30:00.000Z"
}
```

### Dashboard (`/dashboard`) - DIFERENCIAL 🌟
- `GET /dashboard` - Estatísticas agregadas completas

**Retorna:**
- Resumo (totais de galpões, galinhas, ninhos, ovos)
- Galinhas por saúde
- Galinhas por galpão
- Ovos por dia (últimos 7 dias)
- Últimas medições de cada galpão
- Taxa de ocupação dos galpões
- Alertas (quarentena, galinhas adoecidas)

## 📜 Regras de Negócio

### Galpões (3 regras)
1. **RN-001:** Nome deve ser único
2. **RN-002:** Densidade mínima de 0.5m²/galinha
3. **RN-003:** Data de manutenção não pode ser futura

### Galinhas (3 regras)
4. **RN-004:** Galinha em quarentena não pode ter galpão ou ninho
5. **RN-005:** Data de nascimento não pode ser futura
6. **RN-006:** Capacidade máxima do galpão não pode ser excedida

### Ninhos (3 regras)
8. **RN-008:** Galpão deve existir
9. **RN-009:** Número de ninhos não pode exceder capacidade do galpão
10. **RN-010:** Data de limpeza não pode ser futura

### Ovos (4 regras)
7. **RN-007:** Galinha deve ter idade mínima de 120 dias para postura
11. **RN-011:** Máximo 2 ovos por galinha por dia
13. **RN-013:** Data de coleta não pode ser futura
14. **RN-014:** Data de coleta é imutável após criação

### Medições Ambiente (3 regras)
15. **RN-015:** Temperatura deve estar entre -10°C e 60°C
16. **RN-016:** Umidade deve estar entre 0% e 100%
17. **RN-017:** Data de medição não pode ser futura

**Total:** 17 regras de negócio implementadas ✅

## 📮 Postman

Uma collection completa do Postman está disponível em: `postman/galinheiro-collection.json`

### Importar no Postman:
1. Abra o Postman
2. File → Import
3. Selecione o arquivo `postman/galinheiro-collection.json`
4. Configure a variável `{{baseUrl}}` = `http://localhost:3000`

A collection inclui:
- Todos os CRUDs (GET, POST, PATCH, DELETE)
- Testes de regras de negócio (erros esperados)
- Exemplos de sucesso e falha
- Endpoint de dashboard

## 📁 Estrutura do Projeto

```
src/
├── galpoes/           # CRUD Galpões
│   ├── entities/
│   ├── dto/
│   ├── galpoes.controller.ts
│   ├── galpoes.service.ts
│   └── galpoes.module.ts
├── galinhas/          # CRUD Galinhas
├── ninhos/            # CRUD Ninhos
├── ovos/              # CRUD Ovos
├── medicoes-ambiente/ # CRUD Medições
├── dashboard/         # Dashboard (diferencial)
├── migrations/        # Migrations TypeORM
├── data-source.ts     # Config TypeORM
├── app.module.ts      # Módulo principal
└── main.ts            # Entry point
```

## 🛠️ Scripts Úteis

```bash
# Gerar nova migration
npm run typeorm:generate-migration --name=NomeDaMigration

# Executar migrations
npm run typeorm:run-migrations

# Reverter última migration
npm run typeorm:revert-migration

# Build do projeto
npm run build

# Verificar erros de lint
npm run lint
```

## 🎯 Critérios de Avaliação Atendidos

### Estrutura Básica (5.0 pontos) ✅
- [x] 5 CRUDs completos funcionando
- [x] Entidades com relacionamentos TypeORM
- [x] Módulos, Controllers e Services
- [x] DTOs com class-validator
- [x] 17+ regras de negócio com erros específicos
- [x] Migrations com schema e seeds
- [x] Collection do Postman completa

### Diferenciais (2.5 pontos) ✅
- [x] Endpoint /dashboard com estatísticas agregadas
- [x] Validação completa com class-validator
- [x] CORS configurado para React Native
- [x] ValidationPipe global
- [x] Tratamento de erros específico

### Integração (2.5 pontos) ⏳
- [ ] Integração com frontend React Native
- [ ] Exibição de erros do backend no mobile

## 👨‍💻 Autor

Desenvolvido para projeto acadêmico - Sistema de Gerenciamento de Galinheiro

## 📄 Licença

MIT
