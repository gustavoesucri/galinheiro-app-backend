import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Galpao } from '../../galpoes/entities/galpoes.entity';
import { Ninho } from '../../ninhos/entities/ninho.entity';
import { Ovo } from '../../ovos/entities/ovo.entity';

@Entity('galinhas')
export class Galinha {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nome: string;

  @Column({ type: 'enum', enum: ['Boa', 'Fragilizada', 'Adoecida'] })
  saude: string;

  @Column({ length: 100, nullable: true })
  raca: string;

  @Column({ type: 'boolean', default: false })
  emQuarentena: boolean;

  @Column({ type: 'enum', enum: ['galpao', 'campo', 'quarentena'] })
  local: string;

  @Column({ type: 'uuid', nullable: true })
  galpaoId: string;

  @Column({ type: 'uuid', nullable: true })
  ninhoId: string;

  @Column({ type: 'date' })
  data_nascimento: Date;

  @ManyToOne(() => Galpao, (galpao) => galpao.galinhas, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'galpaoId' })
  galpao: Galpao;

  @ManyToOne(() => Ninho, (ninho) => ninho.galinhas, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ninhoId' })
  ninho: Ninho;

  @OneToMany(() => Ovo, (ovo) => ovo.galinha)
  ovos: Ovo[];

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}

