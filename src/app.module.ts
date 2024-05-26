import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/users.entity';
import { ArticklesModule } from './artickles/artickles.module';
import { Artickle } from './users/artickles.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_H,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_U,
      password: process.env.POSTGRES_PAS,
      database: process.env.POSTGRES_DB,
      entities: [User, Artickle],
      autoLoadEntities: true,
      synchronize: false,
    }),
    UsersModule,
    AuthModule,
    ArticklesModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
