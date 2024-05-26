import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create.user.dto';
import { AuthService } from './auth.service';
import { ValidationPipe } from 'src/pipes/validation.pipies';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Post('/login')
  async login(@Body() dto: CreateUserDto) {
    return await this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @UsePipes(ValidationPipe)
  @Post('/registration')
  registration(@Body() dto: CreateUserDto) {
    return this.authService.registration(dto);
  }
}
