import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create.user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService, //использую jwt moduleБ так как в тестовом условии указано, хотя поидее можно было бы сделать через паспортБ но реализовала самый простой вариант
  ) {}

  async login(dto: CreateUserDto) {
    const user = await this.validateUser(dto);
    return this.generateToken(user);
  }

  async registration(dto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(dto.email);
    if (user) {
      throw new BadRequestException('Этот емайл уже есть в базе');
    }
    const hashPassword = await bcrypt.hash(dto.password, 10);
    const userTrue = await this.userService.createUser({
      ...dto,
      password: hashPassword,
    });
    return this.generateToken(userTrue);
  }

  async generateToken(user: User) {
    const payload = {
      email: user.email,
      id: user.id,
      name: user.name,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Пользователь с таким почтовым адресом не найден!',
      });
    }
    const passwordCheck = await bcrypt.compare(userDto.password, user.password);
    if (user && passwordCheck) {
      return user;
    }
    throw new UnauthorizedException({ message: 'Неверная почта или пароль' });
  }
}
