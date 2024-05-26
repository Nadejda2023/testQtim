import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Artickle } from './artickles.entity';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface UserCreate {
  name: string;
  email: string;
  password: string;
}

@Entity()
export class User {
  @ApiProperty({ example: '1', description: 'идентификатор пользователя' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Надя', description: 'Имя пользователя' })
  @Column()
  name: string;

  @ApiProperty({ example: 'fsklever@yahoo.com', description: 'Почта' })
  @Column()
  email: string;

  @ApiProperty({ example: '1234566', description: 'Пароль' })
  @Column()
  password: string;

  @OneToMany(() => Artickle, (artickle) => artickle.author)
  artickle: Artickle[];
}
