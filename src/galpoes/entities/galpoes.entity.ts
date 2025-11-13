import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Ninho } from '../../ninhos/entities/ninho.entity';
import { MedicoesAmbiente } from '../../medicoes-ambiente/entities/medicoes-ambiente.entity';
import { Galinha } from '../../galinhas/entities/galinha.entity';

@Entity('galpoes')
export class Galpao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nome: string;

  @Column({ type: 'int' })
  capacidade_maxima_galinhas: number;

  @Column({ type: 'int' })
  capacidade_maxima_ninhos: number;

  @Column({ type: 'int', default: 0 })
  numero_ninhos_ocupados: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  area_m2: number;

  @Column({ type: 'enum', enum: ['terra', 'concreto', 'serragem'] })
  tipo_piso: string;

  @Column({ type: 'enum', enum: ['natural', 'forçada', 'exaustão'] })
  ventilacao: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @Column({ type: 'timestamp' })
  data_ultima_manutencao: Date;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @OneToMany(() => Ninho, (ninho) => ninho.galpao, { cascade: true })
  ninhos: Ninho[];

  @OneToMany(() => MedicoesAmbiente, (medicao) => medicao.galpao)
  medicoes: MedicoesAmbiente[];

  @OneToMany(() => Galinha, (galinha) => galinha.galpao)
  galinhas: Galinha[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

