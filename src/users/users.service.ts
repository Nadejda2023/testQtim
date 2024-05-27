import { Injectable } from '@nestjs/common';
import { User, UserViewModel } from './users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(dto);
    await this.userRepository.save(user);
    return user;
  }
  async getAllUsers(): Promise<UserViewModel[]> {
    const users: User[] = await this.userRepository.find();
    const usersWithoutPassword: UserViewModel[] = users.map((user) => {
      const userWithoutPassword: UserViewModel = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
      return userWithoutPassword;
    });
    return usersWithoutPassword;
  }
  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }
}
