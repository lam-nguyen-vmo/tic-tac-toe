import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Game } from '../entities/game.entity';
import { BaseRepository } from 'src/configuration/base-repository/base-repository';

@Injectable()
export class GameRepository extends BaseRepository<Game> {
  constructor(dataSource: DataSource) {
    super(Game, dataSource);
  }
}
