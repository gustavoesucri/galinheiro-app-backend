import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Galpao } from '../../galpoes/entities/galpoes.entity';

@Entity('medicoes_ambiente')
export class MedicoesAmbiente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  galpaoId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  temperatura: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  umidade: number;

  @Column({ type: 'int' })
  luminosidade: number;

  @Column({ type: 'boolean', default: true })
  usa_ventilacao: boolean;

  @Column({ type: 'boolean', default: false })
  ventilacao_ativa: boolean;

  @Column({ type: 'timestamp' })
  data_medicao: Date;

  @ManyToOne(() => Galpao, (galpao) => galpao.medicoes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'galpaoId' })
  galpao: Galpao;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}

