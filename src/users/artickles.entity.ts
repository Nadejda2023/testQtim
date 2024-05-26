import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Artickle {
  @ApiProperty({ example: '1', description: 'идентификатор статьи' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Праздник', description: 'Название статьи' })
  @Column()
  title: string;

  @ApiProperty({
    example:
      'Есть интересный праздник, который отмечается в нащей стране ежегодно. День космонавтики...',
    description: 'Описание статьи',
  })
  @Column()
  description: string;

  @ApiProperty({ description: 'Дата создания статьи' })
  @Column()
  createdAt: string;

  @ApiProperty({
    example: '16',
    description:
      'Идентификатор пользователя-автора статьи, только существующий пользователь',
  })
  @ManyToOne(() => User, (user) => user.artickle)
  @JoinColumn({ name: 'authorId' })
  author: number;
}

export type PaginatedArtickle<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
};
