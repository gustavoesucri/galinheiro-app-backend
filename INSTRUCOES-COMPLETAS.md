# 🎯 GUIA COMPLETO - BACKEND GALINHEIRO

## Status: Criado estrutura base, faltam implementações

### ✅ JÁ FEITO
- Projeto NestJS criado
- 5 Resources gerados (galpoes, galinhas, ninhos, ovos, medicoes-ambiente)
- Entidades completas com relacionamentos
- Configuração do TypeORM iniciada
- .env configurado
- Swagger com exemplos implementado
- Captura de requisições/respostas (middleware + interceptor)
- Campos `created_at` e `updated_at` excluídos das respostas

### 📋 TODO - MELHORIAS PENDENTES

#### 🔥 Alta Prioridade
- [ ] **Implementar paginação nos endpoints de listagem (lembrar de aplicar também na UI do frontend)**
  - Adicionar query params: `page`, `limit`, `offset`
  - Retornar metadados: `{ data: [], meta: { total, page, limit, pages } }`
  - Endpoints afetados: GET `/galinhas`, `/galpoes`, `/ninhos`, `/ovos`, `/medicoes-ambiente`
  - Backend: usar TypeORM `.take()` e `.skip()`
  - Frontend: adaptar `resourceFactory.js` para aceitar params de paginação

#### 🎯 Média Prioridade
- [ ] Implementar cache (AsyncStorage no frontend)
- [ ] React.memo nos componentes de Card
- [ ] Debounce nos filtros de busca
- [ ] Otimizar imagens (thumbnails)
- [ ] Autenticação JWT (se necessário para o projeto)

#### 💡 Baixa Prioridade
- [ ] Busca avançada com filtros por múltiplos campos
- [ ] Endpoint de estatísticas avançadas no dashboard
- [ ] Testes E2E automatizados
- [ ] Logger personalizado estruturado

### ❌ FALTA FAZER (PRIORIDADE PARA NOTA 10)

## 1. COMPLETAR APP.MODULE.TS
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    // ... rest of imports
  ],
})
export class AppModule {}
```

## 2. COMPLETAR TODOS OS DTOs

### Exemplo para Galpão (create-galpoe.dto.ts):
```typescript
import { IsString, IsInt, IsEnum, IsBoolean, IsDate, IsOptional, IsNumber, Min, Max, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGalpaoDto {
  @IsString()
  @MaxLength(100)
  nome: string;

  @IsInt()
  @Min(1)
  capacidade_maxima_galinhas: number;

  @IsInt()
  @Min(1)
  capacidade_maxima_ninhos: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  numero_ninhos_ocupados?: number;

  @IsNumber()
  @Min(1)
  area_m2: number;

  @IsEnum(['terra', 'concreto', 'serragem'])
  tipo_piso: string;

  @IsEnum(['natural', 'forçada', 'exaustão'])
  ventilacao: string;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  @IsDate()
  @Type(() => Date)
  data_ultima_manutencao: Date;

  @IsString()
  @IsOptional()
  observacoes?: string;
}
```

Fazer o mesmo para: galinhas, ninhos, ovos, medicoes-ambiente

## 3. IMPLEMENTAR SERVICES COM REGRAS DE NEGÓCIO

### Exemplo Galpoes Service (galpoes.service.ts):
```typescript
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Galpao } from './entities/galpoe.entity';
import { CreateGalpaoDto } from './dto/create-galpoe.dto';

@Injectable()
export class GalpoesService {
  constructor(
    @InjectRepository(Galpao)
    private galpaoRepository: Repository<Galpao>,
  ) {}

  async create(createGalpaoDto: CreateGalpaoDto) {
    // RN-001: Nome único
    const existente = await this.galpaoRepository.findOne({
      where: { nome: createGalpaoDto.nome }
    });
    if (existente) {
      throw new BadRequestException('Já existe um galpão com este nome');
    }

    // RN-002: Densidade mínima
    const densidade = createGalpaoDto.area_m2 / createGalpaoDto.capacidade_maxima_galinhas;
    if (densidade < 0.5) {
      throw new BadRequestException(
        `Densidade muito alta: ${densidade.toFixed(2)}m²/galinha. Mínimo: 0.5m²/galinha`
      );
    }

    // RN-003: Data de manutenção não pode ser futura
    if (createGalpaoDto.data_ultima_manutencao > new Date()) {
      throw new BadRequestException('Data de manutenção não pode ser futura');
    }

    const galpao = this.galpaoRepository.create(createGalpaoDto);
    return this.galpaoRepository.save(galpao);
  }

  async findAll() {
    return this.galpaoRepository.find({
      relations: ['ninhos', 'galinhas', 'medicoes']
    });
  }

  async findOne(id: string) {
    const galpao = await this.galpaoRepository.findOne({
      where: { id },
      relations: ['ninhos', 'galinhas', 'medicoes']
    });
    if (!galpao) {
      throw new NotFoundException(`Galpão com ID ${id} não encontrado`);
    }
    return galpao;
  }

  async update(id: string, updateGalpaoDto: UpdateGalpaoDto) {
    // Aplicar as mesmas regras do create
    await this.findOne(id);
    await this.galpaoRepository.update(id, updateGalpaoDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const galpao = await this.findOne(id);
    return this.galpaoRepository.remove(galpao);
  }
}
```

### REGRAS DE NEGÓCIO POR MÓDULO (mínimo 3 cada):

**Galpões:**
1. Nome único
2. Densidade mínima (área_m2 / capacidade >= 0.5)
3. Data de manutenção não futura

**Galinhas:**
4. Quarentena: não pode ter galpão/ninho
5. Data nascimento não futura
6. Capacidade do galpão não excedida
7. Idade mínima para postura (120 dias)

**Ninhos:**
8. Ninhos ocupados <= capacidade do galpão
9. Galpão deve existir
10. Data de limpeza não futura

**Ovos:**
11. Máximo 2 ovos/galinha/dia
12. Galinha deve ter 120+ dias
13. Data de coleta não futura
14. Data de coleta imutável após criação

**Medições:**
15. Temperatura entre -10 e 60°C
16. Umidade entre 0 e 100%
17. Data de medição não futura

## 4. ADICIONAR TypeORM AOS MÓDULOS

Em cada module.ts, adicionar:
```typescript
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entidade } from './entities/entidade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entidade])],
  // ...
})
```

## 5. CRIAR MIGRATION INICIAL

```bash
npm run typeorm:generate-migration -- Initial
```

Editar migration gerada para adicionar dados iniciais (seeds)

## 6. CRIAR GLOBAL EXCEPTION FILTER

src/common/filters/http-exception.filter.ts

## 7. VALIDAÇÃO GLOBAL NO MAIN.TS

```typescript
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

## 8. CRIAR ENDPOINT DASHBOARD

src/dashboard/dashboard.controller.ts com:
- Total de galinhas por galpão
- Ovos por dia
- Alertas
- Gráficos

## 9. COLLECTION POSTMAN

Criar requests para:
- Todos os CRUDs
- Testes de regras de negócio (erros)
- Casos de sucesso e falha

## 10. SCRIPTS PACKAGE.JSON

Adicionar:
```json
"typeorm": "typeorm-ts-node-commonjs",
"typeorm:run-migrations": "npm run typeorm migration:run -- -d ./src/data-source.ts",
"typeorm:generate-migration": "npm run typeorm -- migration:generate ./src/migrations/$npm_config_name -d ./src/data-source.ts",
"typeorm:create-migration": "npm run typeorm -- migration:create ./src/migrations/$npm_config_name",
"typeorm:revert-migration": "npm run typeorm -- migration:revert -d ./src/data-source.ts"
```

## 🎯 ORDEM DE EXECUÇÃO RECOMENDADA

1. Completar app.module.ts com TypeORM
2. Adicionar TypeOrmModule.forFeature em cada módulo
3. Completar todos os DTOs
4. Implementar services com regras de negócio
5. Adicionar ValidationPipe no main.ts
6. Gerar migration
7. Testar com Postman
8. Criar collection do Postman
9. Implementar dashboard (diferencial)
10. Integrar com frontend

## 📌 COMANDOS ÚTEIS

```bash
# Compilar
npm run build

# Gerar migration
npm run typeorm:generate-migration -- NomeDaMigration

# Rodar migrations
npm run typeorm:run-migrations

# Reverter migration
npm run typeorm:revert-migration

# Iniciar desenvolvimento
npm run start:dev
```

## ✨ DIFERENCIAIS PARA NOTA MÁXIMA

1. ✅ Endpoint de dashboard personalizado
2. ✅ Paginação nos GETs
3. ✅ Filtros avançados
4. ✅ Documentação Swagger (instalar @nestjs/swagger)
5. ✅ Testes E2E
6. ✅ Logger personalizado
7. ✅ CORS configurado para React Native
8. ✅ Validação de relacionamentos (cascade deletes)

Boa sorte! 🚀
