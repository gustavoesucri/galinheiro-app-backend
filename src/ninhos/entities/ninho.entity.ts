import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Galpao } from '../../galpoes/entities/galpoes.entity';
import { Galinha } from '../../galinhas/entities/galinha.entity';
import { Ovo } from '../../ovos/entities/ovo.entity';

@Entity('ninhos')
export class Ninho {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  identificacao: string;

  @Column({ type: 'enum', enum: ['madeira', 'plástico', 'palha'] })
  tipo_material: string;

  @Column({ type: 'uuid' })
  galpaoId: string;

  @Column({ type: 'boolean', default: false })
  ocupado: boolean;

  @Column({ type: 'timestamp' })
  ultima_limpeza: Date;

  @Column({ type: 'uuid', nullable: true })
  galinhaId: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @ManyToOne(() => Galpao, (galpao) => galpao.ninhos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'galpaoId' })
  galpao: Galpao;

  @OneToMany(() => Galinha, (galinha) => galinha.ninho)
  galinhas: Galinha[];

  @OneToMany(() => Ovo, (ovo) => ovo.ninho)
  ovos: Ovo[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

