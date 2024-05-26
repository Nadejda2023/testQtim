import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ArticklesService } from './artickles.service';
import { CreateArtickleDto } from './dto/create.artickle.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from 'src/pipes/validation.pipies';
import { Artickle, PaginatedArtickle } from 'src/users/artickles.entity';
import { getArticklePagination } from 'src/pagination/hellper.pagination';
import { HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateArtickleDto } from './dto/update.artickle.dto';

@ApiTags('Статьи')
@Controller('artickles')
export class ArticklesController {
  constructor(private articklesService: ArticklesService) {}

  @ApiOperation({ summary: 'Показать все статьи с пагинацией' })
  @ApiResponse({ status: 200, type: [Artickle] })
  //@UseGuards(JwtAuthGuard)
  @Get()
  async findAllArtickles(@Query() query, @Res() res) {
    const pagination = getArticklePagination(query);
    const foundAllUsers: PaginatedArtickle<Artickle> =
      await this.articklesService.getAllArtickles(pagination);
    res.status(HttpStatus.OK).json(foundAllUsers);
  }

  @ApiOperation({ summary: 'Показать статью по индефикатору' })
  @ApiResponse({ status: 200, type: Artickle })
  //@UseGuards(JwtAuthGuard)
  @Get(':id')
  async findArticklesById(@Param('id') artickleId: number) {
    return await this.articklesService.getArticklesById(artickleId);
  }

  @ApiOperation({ summary: 'Создание статьи' })
  @ApiResponse({ status: 200, type: Artickle })
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createArtickle(@Body() dto: CreateArtickleDto) {
    const newArtickle = await this.articklesService.createArtickle(dto);
    return newArtickle;
  }

  @ApiOperation({ summary: 'Обновление статьи' })
  @ApiResponse({ status: 204, type: Artickle })
  @UsePipes(ValidationPipe)
  @Put(':id')
  @HttpCode(204)
  async updateArtickle(
    @Param('id') artickleId: number,
    @Body() updateDto: UpdateArtickleDto,
  ) {
    return this.articklesService.updateArtickleById(artickleId, updateDto);
  }

  @ApiOperation({ summary: 'Удалить статью по индефикатору' })
  @ApiResponse({ status: 204, type: Artickle })
  @Delete(':id')
  @HttpCode(204)
  async deleteArticklesById(@Param('id') artickleId: number) {
    return await this.articklesService.deleteArticklesById(artickleId);
  }
}
