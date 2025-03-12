import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { GameResponseDto } from './dto/game-response.dto';
import { SearchGamesResponseDto } from './dto/search-games-response.dto';
import { SearchGamesDto } from './dto/search-games.dto';
import { MakeMoveDto } from './dto/make-move.dto';

@Controller('games')
@ApiTags('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  @ApiOperation({ summary: 'Search games' })
  @ApiOkResponse({ type: SearchGamesResponseDto })
  searchGames(@Query() query: SearchGamesDto): Promise<SearchGamesResponseDto> {
    return this.gamesService.searchGames(query);
  }

  @Get(':gameId')
  @ApiOperation({ summary: 'Get game detail' })
  @ApiOkResponse({ type: GameResponseDto })
  getGameDetail(
    @Param('gameId', ParseUUIDPipe) gameId: string,
  ): Promise<GameResponseDto> {
    return this.gamesService.getGameDetail(gameId);
  }

  @Post()
  @ApiOperation({ summary: 'User create a new game' })
  @ApiBody({ type: CreateGameDto })
  @ApiCreatedResponse({ type: GameResponseDto })
  createNewGame(@Body() body: CreateGameDto): Promise<GameResponseDto> {
    return this.gamesService.createNewGame(body);
  }

  @Post('make-move')
  @ApiOperation({ summary: 'User make move & get game result' })
  @ApiBody({ type: MakeMoveDto })
  @ApiOkResponse({ type: GameResponseDto })
  makeMove(@Body() body: MakeMoveDto): Promise<GameResponseDto> {
    return this.gamesService.makeMove(body);
  }
}
