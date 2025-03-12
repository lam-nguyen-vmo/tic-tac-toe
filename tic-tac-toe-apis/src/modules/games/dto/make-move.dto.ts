import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID, Max, Min } from 'class-validator';
import { BOARD_SIZE } from 'src/common/constants/constant';
import { UsernameDto } from 'src/modules/users/dto/username.dto';

export class MakeMoveDto extends UsernameDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(BOARD_SIZE - 1)
  row: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(BOARD_SIZE - 1)
  col: number;
}
