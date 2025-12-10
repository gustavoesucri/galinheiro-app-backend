import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Galinha } from '../../galinhas/entities/galinha.entity';
import { Ninho } from '../../ninhos/entities/ninho.entity';

@Entity('ovos')
export class Ovo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  data: Date;

  @Column({ type: 'uuid', nullable: true })
  galinhaId: string;

  @Column({ type: 'uuid', nullable: true })
  ninhoId: string;

  @Column({ type: 'enum', enum: ['Pequeno', 'Médio', 'Grande', 'Extra'] })
  tamanho: string;

  @Column({ type: 'enum', enum: ['Branco', 'Marrom', 'Azul', 'Verde'] })
  cor: string;

  @Column({ type: 'enum', enum: ['Boa', 'Quebrado', 'Defeituoso'] })
  qualidade: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @ManyToOne(() => Galinha, (galinha) => galinha.ovos, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'galinhaId' })
  galinha: Galinha;

  @ManyToOne(() => Ninho, (ninho) => ninho.ovos, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ninhoId' })
  ninho: Ninho;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}

