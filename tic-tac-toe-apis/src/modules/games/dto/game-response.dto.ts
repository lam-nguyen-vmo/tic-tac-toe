import { ApiProperty } from '@nestjs/swagger';
import { Game } from '../entities/game.entity';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';

export class GameResponseDto extends CommonResponseDto {
  @ApiProperty()
  data: Game;
}
