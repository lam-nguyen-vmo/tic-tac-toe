import { USERNAME_MAX_LENGTH } from 'src/common/constants/constant';
import { BaseUuidColumn } from 'src/configuration/base-entity';
import { Game } from 'src/modules/games/entities/game.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('users')
export class User extends BaseUuidColumn {
  @Column({ type: 'varchar', length: USERNAME_MAX_LENGTH, nullable: false })
  username: string;

  // relations
  @OneToMany(() => Game, (game) => game.player, { eager: false })
  games: Game[];
}
