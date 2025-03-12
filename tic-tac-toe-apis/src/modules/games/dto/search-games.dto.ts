import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GameStatus, WinnerType } from '../entities/game.entity';
import { CommonPaginationDto } from 'src/common/dto/common-pagination.dto';

export enum GAME_SORT_FIELD {
  CREATED_AT = 'created_at',
  STATUS = 'status',
}

export class SearchGamesDto extends CommonPaginationDto {
  @ApiProperty({ default: 'lamnguyen' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ enum: WinnerType, required: false })
  @IsEnum(WinnerType)
  @IsOptional()
  winner?: WinnerType;

  @ApiProperty({ enum: GameStatus, required: false })
  @IsEnum(GameStatus)
  @IsOptional()
  status?: GameStatus;

  @ApiProperty({
    required: false,
    enum: GAME_SORT_FIELD,
    description: 'sort field',
  })
  @IsOptional()
  @IsEnum(GAME_SORT_FIELD)
  sort_by?: GAME_SORT_FIELD;
}
