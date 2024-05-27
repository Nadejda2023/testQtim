import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artickle, PaginatedArtickle } from '../users/artickles.entity';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { CreateArtickleDto } from './dto/create.artickle.dto';
import { TArticklePagination } from '../pagination/hellper.pagination';
import { UpdateArtickleDto } from './dto/update.artickle.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ArticklesService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
    const savedArtickle = await this.artickleRepository.save(artickle);

    await this.cacheManager.del('all_artickles');

    return savedArtickle;
  }

  async getAllArtickles(
    pagination: TArticklePagination,
  ): Promise<PaginatedArtickle<Artickle>> {
    const cacheKey = `all_artickles_${pagination.pageNumber}_${pagination.pageSize}_${pagination.sortBy}_${pagination.sortDirection}`;
    const cached =
      await this.cacheManager.get<PaginatedArtickle<Artickle>>(cacheKey);

    if (cached) {
      return cached;
    }

    const [result, totalCount] = await this.artickleRepository.findAndCount({
      relations: ['author'],
      order: { [pagination.sortBy]: pagination.sortDirection.toUpperCase() },
      skip: pagination.skip,
      take: pagination.pageSize,
    });

    const pageCount: number = Math.ceil(totalCount / pagination.pageSize);

    const paginatedResult: PaginatedArtickle<Artickle> = {
      pagesCount: pageCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: totalCount,
      items: result,
    };

    await this.cacheManager.set(cacheKey, paginatedResult, 600);

    return paginatedResult;
  }

  async getArticklesById(id: number) {
    const cacheKey = `artickle_${id}`;
    let artickle = await this.cacheManager.get(cacheKey);

    if (!artickle) {
      artickle = await this.artickleRepository.findOne({
        where: { id: id },
        relations: ['author'],
      });

      if (!artickle) {
        throw new NotFoundException();
      }

      await this.cacheManager.set(cacheKey, artickle, 300);
    }

    return artickle;
  }
  async deleteArticklesById(id: number) {
    const result = await this.artickleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }

    await this.cacheManager.del('all_artickles');
    return true;
  }

  async updateArtickleById(id: number, dto: UpdateArtickleDto) {
    const artickle = await this.artickleRepository.findOne({
      where: { id: id },
      //relations: ['author'],
    });
    if (!artickle) throw new NotFoundException();
    await this.artickleRepository.update(id, {
      title: dto.title,
      description: dto.description,
      createdAt: new Date().toISOString(),
      author: artickle.author,
    });

    await this.cacheManager.del('all_artickles');

    return true;
  }
}
