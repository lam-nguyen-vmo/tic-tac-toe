import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GameRepository } from './repositories/game.repository';
import { UsersService } from '../users/users.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Transactional } from 'typeorm-transactional';
import { GameResponseDto } from './dto/game-response.dto';
import { generateGameCode } from 'src/common/utils/utils';
import {
  GAME_IS_OVER,
  GAME_NOT_FOUND,
  INVALID_MOVE,
} from 'src/common/constants/error-messages';
import { SearchGamesResponseDto } from './dto/search-games-response.dto';
import { SearchGamesDto } from './dto/search-games.dto';
import { MakeMoveDto } from './dto/make-move.dto';
import { Game, GameStatus, WinnerType } from './entities/game.entity';
import { BOARD_SIZE, MoveType } from 'src/common/constants/constant';
import {
  BOT_WIN,
  GAME_DRAW,
  GAME_IN_PROGRESS,
  USER_WIN,
} from 'src/common/constants/messages';

@Injectable()
export class GamesService {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly usersService: UsersService,
  ) {}

  async searchGames(query: SearchGamesDto): Promise<SearchGamesResponseDto> {
    const {
      username,
      code,
      status,
      winner,
      page,
      limit,
      sort_order: sortOrder,
      sort_by: sortBy,
    } = query;
    const qb = this.gameRepository
      .createQueryBuilder('game')
      .innerJoinAndSelect('game.player', 'player');

    // filter by username
    if (username) {
      qb.andWhere('player.username = :username', { username });
    }

    // filter by code
    if (code) {
      qb.andWhere('game.code = :code', { code });
    }

    // filter by status
    if (status) {
      qb.andWhere('game.status = :status', { status });
    }

    // filter by winner type
    if (winner) {
      qb.andWhere('game.winner = :winner', { winner });
    }

    // sort
    if (sortBy && sortOrder) {
      qb.orderBy(`game.${sortBy}`, sortOrder);
    }

    const [games, itemCount] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      statusCode: HttpStatus.OK,
      success: true,
      data: games,
      total: itemCount,
    };
  }

  async getGameDetail(gameId: string): Promise<GameResponseDto> {
    const game = await this.gameRepository.findOneBy({ id: gameId });
    if (!game) {
      throw new NotFoundException(GAME_NOT_FOUND);
    }

    return {
      statusCode: HttpStatus.OK,
      success: true,
      data: game,
    };
  }

  @Transactional()
  async createNewGame(body: CreateGameDto): Promise<GameResponseDto> {
    const { username } = body;

    // create or retrieve user
    const user = await this.usersService.createUser(username);

    // create new game
    const newGame = await this.gameRepository.save({
      code: generateGameCode(),
      userId: user.id,
    });

    return {
      statusCode: HttpStatus.CREATED,
      success: true,
      data: newGame,
    };
  }

  @Transactional()
  async makeMove(body: MakeMoveDto): Promise<GameResponseDto> {
    const { username, gameId, row, col } = body;

    const game = await this.gameRepository
      .createQueryBuilder('game')
      .innerJoinAndSelect('game.player', 'player')
      .where('game.id = :gameId', { gameId })
      .andWhere('player.username = :username', { username })
      .getOne();

    if (!game) {
      throw new NotFoundException(GAME_NOT_FOUND);
    }
    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new BadRequestException(GAME_IS_OVER);
    }
    if (game.board[row][col]) {
      throw new BadRequestException(INVALID_MOVE);
    }

    // user move (X) & check winner
    game.board[row][col] = MoveType.USER;
    if (this.checkWinner(game.board, MoveType.USER)) {
      game.winner = WinnerType.USER;
      game.status = GameStatus.FINISHED;
      return await this.makeMoveReponse(game, USER_WIN);
    }

    // Bot move (O) & check winner
    const botMovePos = this.getBotMovePosition(game.board);
    if (!botMovePos) {
      game.winner = WinnerType.DRAW;
      game.status = GameStatus.FINISHED;
      return await this.makeMoveReponse(game, GAME_DRAW);
    }
    game.board[botMovePos.row][botMovePos.col] = MoveType.BOT;

    if (this.checkWinner(game.board, MoveType.BOT)) {
      game.winner = WinnerType.BOT;
      game.status = GameStatus.FINISHED;
      return await this.makeMoveReponse(game, BOT_WIN);
    }

    // check draw
    if (this.checkDraw(game.board)) {
      game.winner = WinnerType.DRAW;
      game.status = GameStatus.FINISHED;
      return await this.makeMoveReponse(game, GAME_DRAW);
    }

    return await this.makeMoveReponse(game, GAME_IN_PROGRESS);
  }

  // Old bot move logic
  // private getBotMovePosition(board: string[][]) {
  //   const emptyPositions: [number, number][] = [];
  //   for (let i = 0; i < BOARD_SIZE; i++) {
  //     for (let j = 0; j < BOARD_SIZE; j++) {
  //       if (board[i][j] === '') {
  //         emptyPositions.push([i, j]);
  //       }
  //     }
  //   }

  //   if (emptyPositions.length === 0) return null;

  //   // get random position to move
  //   const randomIdx = Math.floor(Math.random() * emptyPositions.length);
  //   const [row, col] = emptyPositions[randomIdx];

  //   return { row, col };
  // }

  // New bot movement logic using Minimax algorithm
  private getBotMovePosition(board: string[][]) {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j] === '') {
          board[i][j] = MoveType.BOT; // Simulate bot move
          const score = this.minimax(board, 0, false);
          board[i][j] = ''; // Undo bot move

          if (score > bestScore) {
            bestScore = score;
            bestMove = { row: i, col: j };
          }
        }
      }
    }

    return bestMove;
  }

  private minimax(
    board: string[][],
    depth: number,
    isMaximizing: boolean,
  ): number {
    if (this.checkWinner(board, MoveType.BOT)) return 100 - depth;
    if (this.checkWinner(board, MoveType.USER)) return depth - 100;
    if (this.checkDraw(board)) return 0;

    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j] === '') {
          board[i][j] = isMaximizing ? MoveType.BOT : MoveType.USER; // true -> bot's turn, false: player's turn
          const score = this.minimax(board, depth + 1, !isMaximizing);
          board[i][j] = ''; // Undo move

          bestScore = isMaximizing
            ? Math.max(score, bestScore)
            : Math.min(score, bestScore);
        }
      }
    }

    return bestScore;
  }

  private checkWinner(board: string[][], moveType: MoveType): boolean {
    const boardSizeArr = [...Array(BOARD_SIZE).keys()]; // [0, 1, 2]
    // Check rows
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (board[i].every((cell) => cell === moveType)) return true;
    }

    // Check columns
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (boardSizeArr.every((j) => board[j][i] === moveType)) return true;
    }

    // Check diagonals
    if (boardSizeArr.every((i) => board[i][i] === moveType)) return true;
    if (boardSizeArr.every((i) => board[i][BOARD_SIZE - 1 - i] === moveType))
      return true;

    return false;
  }

  private checkDraw(board: string[][]): boolean {
    return board.flat().every((cell) => cell !== '');
  }

  private async makeMoveReponse(game: Game, message: string) {
    return {
      statusCode: HttpStatus.OK,
      success: true,
      data: await this.gameRepository.save(game),
      message,
    };
  }
}
