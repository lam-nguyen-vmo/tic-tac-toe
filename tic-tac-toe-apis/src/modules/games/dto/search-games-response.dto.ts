import { ApiProperty } from '@nestjs/swagger';
import { Game } from '../entities/game.entity';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';
import { IsNumber } from 'class-validator';

export class SearchGamesResponseDto extends CommonResponseDto {
  @ApiProperty()
  data: Game[];

  @ApiProperty()
  @IsNumber()
  total: number;
}
