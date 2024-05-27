import { forwardRef } from '@nestjs/common';
import { ArticklesController } from './artickles.controller';
import { ArticklesService } from './artickles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artickle } from '../users/artickles.entity';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([Artickle]),
    CacheModule.register(),
    forwardRef(() => UsersModule),
    JwtModule,
    AuthModule,
  ],
  controllers: [ArticklesController],
  providers: [ArticklesService],
})
export class ArticklesModule {}
