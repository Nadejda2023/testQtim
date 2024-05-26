import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artickle, PaginatedArtickle } from 'src/users/artickles.entity';
import { Repository } from 'typeorm';
import { CreateArtickleDto } from './dto/create.artickle.dto';
import { TArticklePagination } from 'src/pagination/hellper.pagination';
import { UpdateArtickleDto } from './dto/update.artickle.dto';

@Injectable()
export class ArticklesService {
  constructor(
    @InjectRepository(Artickle)
    private artickleRepository: Repository<Artickle>,
  ) {}

  async createArtickle(dto: CreateArtickleDto): Promise<Artickle> {
    const newArtickle = {
      title: dto.title,
      description: dto.description,
      createdAt: new Date().toISOString(),
      author: dto.author,
    };

    const artickle = await this.artickleRepository.create({ ...newArtickle });
    return this.artickleRepository.save(artickle);
  }

  async getAllArtickles(
    pagination: TArticklePagination,
  ): Promise<PaginatedArtickle<Artickle>> {
    const [result, totalCount] = await this.artickleRepository.findAndCount({
      //where: whereCondition,
      relations: ['author'],
      order: { [pagination.sortBy]: pagination.sortDirection.toUpperCase() },
      skip: pagination.skip,
      take: pagination.pageSize,
    });

    const pageCount: number = Math.ceil(totalCount / pagination.pageSize);

    return {
      pagesCount: pageCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: totalCount,
      items: result,
    };
  }

  async updateArtickleById(id: number, dto: UpdateArtickleDto) {
    const artickle = await this.artickleRepository.findOne({
      where: { id: id },
    });
    if (!artickle) throw new NotFoundException();
    await this.artickleRepository.update(id, {
      title: dto.title,
      description: dto.description,
      createdAt: dto.createdAt,
      author: artickle.author,
    });
    return await this.artickleRepository.findOne({ where: { id: id } });
  }
}
