import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { USERNAME_MAX_LENGTH } from 'src/common/constants/constant';

export class UsernameDto {
  @ApiProperty({ default: 'lamnguyen' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(USERNAME_MAX_LENGTH)
  username: string;
}
