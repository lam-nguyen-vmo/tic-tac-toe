import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('games')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
