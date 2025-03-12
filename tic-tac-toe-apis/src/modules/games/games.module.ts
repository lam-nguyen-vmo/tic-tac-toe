import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { Game } from './entities/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { GameRepository } from './repositories/game.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), UsersModule],
  controllers: [GamesController],
  providers: [GamesService, GameRepository],
})
export class GamesModule {}
