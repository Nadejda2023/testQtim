import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Надя', description: 'Имя пользователя' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(1, 16, { message: 'Не меньше 1 символа и не больше 16 символов' })
  @IsNotEmpty()
  readonly name: string;
  @ApiProperty({ example: 'fsklever@yahoo.com', description: 'Почта' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
  @ApiProperty({ example: '1234566', description: 'Пароль' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(1, 16, { message: 'Не меньше 1 символа и не больше 16 символов' })
  @IsNotEmpty()
  readonly password: string;
}
