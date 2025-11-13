import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1731456000000 implements MigrationInterface {
  name = 'Initial1731456000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela galpoes
    await queryRunner.query(`
      CREATE TABLE galpoes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome VARCHAR(100) NOT NULL UNIQUE,
        capacidade_maxima_galinhas INTEGER NOT NULL CHECK (capacidade_maxima_galinhas >= 1),
        capacidade_maxima_ninhos INTEGER NOT NULL CHECK (capacidade_maxima_ninhos >= 1),
        numero_ninhos_ocupados INTEGER DEFAULT 0 CHECK (numero_ninhos_ocupados >= 0),
        area_m2 DECIMAL(10,2) NOT NULL CHECK (area_m2 >= 1),
        tipo_piso VARCHAR(20) NOT NULL CHECK (tipo_piso IN ('terra', 'concreto', 'serragem')),
        ventilacao VARCHAR(20) NOT NULL CHECK (ventilacao IN ('natural', 'forçada', 'exaustão')),
        ativo BOOLEAN DEFAULT true,
        data_ultima_manutencao TIMESTAMP NOT NULL,
        observacoes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Criar tabela galinhas
    await queryRunner.query(`
      CREATE TABLE galinhas (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome VARCHAR(100) NOT NULL,
        saude VARCHAR(20) NOT NULL CHECK (saude IN ('Boa', 'Fragilizada', 'Adoecida')),
        raca VARCHAR(100),
        emQuarentena BOOLEAN DEFAULT false,
        local VARCHAR(20) NOT NULL CHECK (local IN ('galpao', 'campo', 'quarentena')),
        galpaoId UUID,
        ninhoId UUID,
        data_nascimento DATE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT fk_galinha_galpao FOREIGN KEY (galpaoId) REFERENCES galpoes(id) ON DELETE SET NULL,
        CONSTRAINT fk_galinha_ninho FOREIGN KEY (ninhoId) REFERENCES ninhos(id) ON DELETE SET NULL
      );
    `);

    // Criar tabela ninhos
    await queryRunner.query(`
      CREATE TABLE ninhos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        identificacao VARCHAR(100) NOT NULL,
        tipo_material VARCHAR(20) NOT NULL CHECK (tipo_material IN ('madeira', 'plástico', 'palha')),
        galpaoId UUID NOT NULL,
        ocupado BOOLEAN DEFAULT false,
        ultima_limpeza TIMESTAMP,
        galinhaId UUID,
        observacoes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT fk_ninho_galpao FOREIGN KEY (galpaoId) REFERENCES galpoes(id) ON DELETE CASCADE
      );
    `);

    // Criar tabela ovos
    await queryRunner.query(`
      CREATE TABLE ovos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        data DATE NOT NULL,
        galinhaId UUID,
        ninhoId UUID,
        tamanho VARCHAR(20) NOT NULL CHECK (tamanho IN ('Pequeno', 'Médio', 'Grande')),
        cor VARCHAR(20) NOT NULL CHECK (cor IN ('Branco', 'Marrom', 'Verde')),
        qualidade VARCHAR(20) NOT NULL CHECK (qualidade IN ('Boa', 'Rachado', 'Sujo')),
        observacoes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT fk_ovo_galinha FOREIGN KEY (galinhaId) REFERENCES galinhas(id) ON DELETE SET NULL,
        CONSTRAINT fk_ovo_ninho FOREIGN KEY (ninhoId) REFERENCES ninhos(id) ON DELETE SET NULL
      );
    `);

    // Criar tabela medicoes_ambiente
    await queryRunner.query(`
      CREATE TABLE medicoes_ambiente (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        galpaoId UUID NOT NULL,
        temperatura DECIMAL(5,2) NOT NULL CHECK (temperatura >= -10 AND temperatura <= 60),
        umidade DECIMAL(5,2) NOT NULL CHECK (umidade >= 0 AND umidade <= 100),
        luminosidade INTEGER NOT NULL CHECK (luminosidade >= 0 AND luminosidade <= 100000),
        usa_ventilacao BOOLEAN DEFAULT true,
        ventilacao_ativa BOOLEAN DEFAULT false,
        data_medicao TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT fk_medicao_galpao FOREIGN KEY (galpaoId) REFERENCES galpoes(id) ON DELETE CASCADE
      );
    `);

    // Adicionar constraints de foreign key que dependem de tabelas criadas depois
    await queryRunner.query(`
      ALTER TABLE galinhas
      ADD CONSTRAINT fk_galinha_ninho FOREIGN KEY (ninhoId) REFERENCES ninhos(id) ON DELETE SET NULL;
    `);

    // Dados iniciais (seeds)
    await queryRunner.query(`
      INSERT INTO galpoes (nome, capacidade_maxima_galinhas, capacidade_maxima_ninhos, area_m2, tipo_piso, ventilacao, data_ultima_manutencao)
      VALUES 
        ('Galpão Principal', 50, 20, 100.00, 'concreto', 'forçada', '2025-11-01'),
        ('Galpão Secundário', 30, 15, 60.00, 'serragem', 'natural', '2025-11-05');
    `);

    await queryRunner.query(`
      INSERT INTO ninhos (identificacao, tipo_material, galpaoId, ocupado)
      SELECT 
        CONCAT('Ninho-', (ROW_NUMBER() OVER ())),
        'madeira',
        id,
        false
      FROM galpoes
      LIMIT 10;
    `);

    await queryRunner.query(`
      INSERT INTO galinhas (nome, saude, raca, local, data_nascimento, galpaoId)
      SELECT 
        CONCAT('Galinha-', (ROW_NUMBER() OVER ())),
        'Boa',
        'Rhode Island Red',
        'galpao',
        CURRENT_DATE - INTERVAL '200 days',
        id
      FROM galpoes
      LIMIT 20;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS medicoes_ambiente CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ovos CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS galinhas CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ninhos CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS galpoes CASCADE;`);
  }
}
