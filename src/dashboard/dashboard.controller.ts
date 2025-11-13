import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Galpao } from '../galpoes/entities/galpoes.entity';
import { Galinha } from '../galinhas/entities/galinha.entity';
import { Ninho } from '../ninhos/entities/ninho.entity';
import { Ovo } from '../ovos/entities/ovo.entity';
import { MedicoesAmbiente } from '../medicoes-ambiente/entities/medicoes-ambiente.entity';

@Controller('dashboard')
export class DashboardController {
  constructor(
    @InjectRepository(Galpao)
    private galpaoRepository: Repository<Galpao>,
    @InjectRepository(Galinha)
    private galinhaRepository: Repository<Galinha>,
    @InjectRepository(Ninho)
    private ninhoRepository: Repository<Ninho>,
    @InjectRepository(Ovo)
    private ovoRepository: Repository<Ovo>,
    @InjectRepository(MedicoesAmbiente)
    private medicaoRepository: Repository<MedicoesAmbiente>,
  ) {}

  @Get()
  async getStatistics() {
    // Contadores básicos
    const totalGalpoes = await this.galpaoRepository.count();
    const galpoesAtivos = await this.galpaoRepository.count({
      where: { ativo: true },
    });
    const totalGalinhas = await this.galinhaRepository.count();
    const galinhasQuarentena = await this.galinhaRepository.count({
      where: { emQuarentena: true },
    });
    const totalNinhos = await this.ninhoRepository.count();
    const ninhosOcupados = await this.ninhoRepository.count({
      where: { ocupado: true },
    });
    const totalOvos = await this.ovoRepository.count();

    // Ovos coletados hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    const ovosHoje = await this.ovoRepository
      .createQueryBuilder('ovo')
      .where('ovo.data >= :hoje', { hoje })
      .andWhere('ovo.data < :amanha', { amanha })
      .getCount();

    // Galinhas por saúde
    const galinhasPorSaude = await this.galinhaRepository
      .createQueryBuilder('galinha')
      .select('galinha.saude', 'saude')
      .addSelect('COUNT(*)', 'total')
      .groupBy('galinha.saude')
      .getRawMany();

    // Galinhas por galpão
    const galinhasPorGalpao = await this.galinhaRepository
      .createQueryBuilder('galinha')
      .leftJoin('galinha.galpao', 'galpao')
      .select('galpao.nome', 'galpao')
      .addSelect('COUNT(galinha.id)', 'total')
      .where('galinha.galpaoId IS NOT NULL')
      .groupBy('galpao.nome')
      .getRawMany();

    // Ovos dos últimos 7 dias
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

    const ovosPorDia = await this.ovoRepository
      .createQueryBuilder('ovo')
      .select("TO_CHAR(ovo.data, 'YYYY-MM-DD')", 'dia')
      .addSelect('COUNT(*)', 'total')
      .where('ovo.data >= :seteDiasAtras', { seteDiasAtras })
      .groupBy("TO_CHAR(ovo.data, 'YYYY-MM-DD')")
      .orderBy("TO_CHAR(ovo.data, 'YYYY-MM-DD')", 'ASC')
      .getRawMany();

    // Última medição de cada galpão
    const ultimasMedicoes = await this.medicaoRepository
      .createQueryBuilder('medicao')
      .leftJoinAndSelect('medicao.galpao', 'galpao')
      .select([
        'galpao.nome as galpao',
        'medicao.temperatura as temperatura',
        'medicao.umidade as umidade',
        'medicao.luminosidade as luminosidade',
        'medicao.data_medicao as data',
      ])
      .orderBy('medicao.data_medicao', 'DESC')
      .limit(totalGalpoes)
      .getRawMany();

    // Alertas (galinhas em quarentena, ninhos que precisam limpeza, etc)
    const alertas: Array<{
      tipo: string;
      mensagem: string;
      severidade: string;
    }> = [];

    if (galinhasQuarentena > 0) {
      alertas.push({
        tipo: 'quarentena',
        mensagem: `${galinhasQuarentena} galinha(s) em quarentena`,
        severidade: 'warning',
      });
    }

    const galinhasAdoecidas = await this.galinhaRepository.count({
      where: { saude: 'Adoecida' },
    });
    if (galinhasAdoecidas > 0) {
      alertas.push({
        tipo: 'saude',
        mensagem: `${galinhasAdoecidas} galinha(s) adoecida(s)`,
        severidade: 'error',
      });
    }

    // Taxa de ocupação dos galpões
    const taxaOcupacao = await this.galpaoRepository
      .createQueryBuilder('galpao')
      .leftJoin('galpao.galinhas', 'galinha')
      .select([
        'galpao.nome as galpao',
        'galpao.capacidade_maxima_galinhas as capacidade',
        'COUNT(galinha.id) as ocupadas',
        'ROUND((COUNT(galinha.id)::DECIMAL / galpao.capacidade_maxima_galinhas) * 100, 2) as percentual',
      ])
      .groupBy('galpao.id')
      .getRawMany();

    return {
      resumo: {
        galpoes: { total: totalGalpoes, ativos: galpoesAtivos },
        galinhas: { total: totalGalinhas, quarentena: galinhasQuarentena },
        ninhos: { total: totalNinhos, ocupados: ninhosOcupados },
        ovos: { total: totalOvos, hoje: ovosHoje },
      },
      galinhasPorSaude,
      galinhasPorGalpao,
      ovosPorDia,
      ultimasMedicoes,
      taxaOcupacao,
      alertas,
    };
  }
}
