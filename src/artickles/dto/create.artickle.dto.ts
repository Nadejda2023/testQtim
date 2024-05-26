import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateArtickleDto {
  @ApiProperty({ example: 'Праздник', description: 'Название статьи' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(1, 16, { message: 'Не меньше 1 символа и не больше 16 символов' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example:
      'Есть интересный праздник, который отмечается в нащей стране ежегодно. День космонавтики...',
    description: 'Описание статьи',
  })
  @IsString({ message: 'Должно быть строкой' })
  @Length(1, 160, { message: 'Не меньше 1 символа и не больше 160 символов' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Дата создания статьи' })
  createdAt: string;

  @ApiProperty({
    example: '16',
    description: 'Идентификатор пользователя-автора статьи',
  })
  @IsNotEmpty()
  author: number;
}
