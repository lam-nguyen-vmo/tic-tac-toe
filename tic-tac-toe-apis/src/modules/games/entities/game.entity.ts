import { BaseUuidColumn } from 'src/configuration/base-entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum GameStatus {
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
}

export enum WinnerType {
  USER = 'user',
  BOT = 'bot',
  DRAW = 'draw',
}

@Entity('games')
export class Game extends BaseUuidColumn {
  @Column({
    type: 'varchar',
    length: 6,
    nullable: false,
  })
  code: string;

  @Column({
    type: 'text',
    array: true,
    default: () => `ARRAY[['', '', ''], ['', '', ''], ['', '', '']]::text[][]`,
    nullable: false,
  })
  board: string[][];

  @Column({
    type: 'enum',
    nullable: true,
    enum: WinnerType,
    default: null,
  })
  winner: WinnerType;

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: GameStatus,
    default: GameStatus.IN_PROGRESS,
  })
  status: GameStatus;

  // relations
  @ManyToOne(() => User, (user) => user.games, { eager: false })
  @JoinColumn({
    name: 'user_id',
  })
  player: User;
}
