import { Module, forwardRef } from '@nestjs/common';
import { ArticklesController } from './artickles.controller';
import { ArticklesService } from './artickles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artickle } from '../users/artickles.entity';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Artickle]),
    forwardRef(() => UsersModule),
    JwtModule,
    AuthModule,
  ],
  controllers: [ArticklesController],
  providers: [ArticklesService],
})
export class ArticklesModule {}
