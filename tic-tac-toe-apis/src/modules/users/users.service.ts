import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  findOneByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  async createUser(username: string) {
    const existedUser = await this.findOneByUsername(username);
    if (existedUser) return existedUser;

    return await this.userRepository.save({ username });
  }
}
