import { Artickle } from '../users/artickles.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ArticklesService } from './artickles.service';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateArtickleDto } from './dto/create.artickle.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateArtickleDto } from './dto/update.artickle.dto';

describe('ArticklesService', () => {
  let service: ArticklesService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: Repository<Artickle>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let cacheManager: Cache;

  const mockArtickleRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticklesService,
        {
          provide: getRepositoryToken(Artickle),
          useValue: mockArtickleRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<ArticklesService>(ArticklesService);
    repository = module.get<Repository<Artickle>>(getRepositoryToken(Artickle));
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('должен быть определен', () => {
    expect(service).toBeDefined();
  });

  describe('createArtickle', () => {
    it('создать статью и почистить кэш', async () => {
      const dto: CreateArtickleDto = {
        title: 'Test Title',
        description: 'Test Description',
        author: 2,
        createdAt: '',
      };
      const savedArtickle = {
        id: 1,
        ...dto,
        createdAt: new Date().toISOString(),
      };

      mockArtickleRepository.create.mockReturnValue(savedArtickle);
      mockArtickleRepository.save.mockResolvedValue(savedArtickle);
      mockCacheManager.del.mockResolvedValue(undefined);

      const result = await service.createArtickle(dto);

      expect(mockArtickleRepository.create).toHaveBeenCalledWith({
        ...dto,
        createdAt: expect.any(String),
      });
      expect(mockArtickleRepository.save).toHaveBeenCalledWith(savedArtickle);
      expect(mockCacheManager.del).toHaveBeenCalledWith('all_artickles');
      expect(result).toEqual(savedArtickle);
    });
    describe('getArticklesById', () => {
      it('вернуть статью из кэша', async () => {
        const cachedArtickle = {
          id: 1,
          title: 'Cached Title',
          description: 'Cached Description',
          author: { id: 1, name: 'Cached Author' },
          createdAt: '2022-01-01T00:00:00Z',
        };
        mockCacheManager.get.mockResolvedValue(cachedArtickle);

        const result = await service.getArticklesById(1);

        expect(mockCacheManager.get).toHaveBeenCalledWith('artickle_1');
        expect(result).toEqual(cachedArtickle);
      });

      it('вернуть статью', async () => {
        const repoArtickle = {
          id: 1,
          title: 'Repo Title',
          description: 'Repo Description',
          author: { id: 1, name: 'Repo Author' },
          createdAt: '2022-01-01T00:00:00Z',
        };
        mockCacheManager.get.mockResolvedValue(undefined);
        mockArtickleRepository.findOne.mockResolvedValue(repoArtickle);
        mockCacheManager.set.mockResolvedValue(undefined);

        const result = await service.getArticklesById(1);

        expect(mockCacheManager.get).toHaveBeenCalledWith('artickle_1');
        expect(mockArtickleRepository.findOne).toHaveBeenCalledWith({
          where: { id: 1 },
          relations: ['author'],
        });
        expect(mockCacheManager.set).toHaveBeenCalledWith(
          'artickle_1',
          repoArtickle,
          300,
        );
        expect(result).toEqual(repoArtickle);
      });

      it('кинуть ошибку 404 если статья не найдена', async () => {
        mockCacheManager.get.mockResolvedValue(undefined);
        mockArtickleRepository.findOne.mockResolvedValue(undefined);

        await expect(service.getArticklesById(1)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('deleteArticklesById', () => {
      it('удалить статью и инвалидировать кэш', async () => {
        mockArtickleRepository.delete.mockResolvedValue({ affected: 1 });
        mockCacheManager.del.mockResolvedValue(undefined);

        const result = await service.deleteArticklesById(1);

        expect(mockArtickleRepository.delete).toHaveBeenCalledWith(1);
        expect(mockCacheManager.del).toHaveBeenCalledWith('all_artickles');
        expect(result).toBe(true);
      });

      it('должен выкинуть ошибку 404 если статья не найдена', async () => {
        mockArtickleRepository.delete.mockResolvedValue({ affected: 0 });

        await expect(service.deleteArticklesById(1)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('updateArtickleById', () => {
      it('обновить и почистить кэш', async () => {
        const dto: UpdateArtickleDto = {
          title: 'Updated Title',
          description: 'Updated Description',
          createdAt: '',
        };
        const artickle = {
          id: 1,
          title: 'Old Title',
          description: 'Old Description',
          author: { id: 1, name: 'Author' },
          createdAt: '2022-01-01T00:00:00Z',
        };

        mockArtickleRepository.findOne.mockResolvedValue(artickle);
        mockArtickleRepository.update.mockResolvedValue(undefined);
        mockCacheManager.del.mockResolvedValue(undefined);

        const result = await service.updateArtickleById(1, dto);

        expect(mockArtickleRepository.findOne).toHaveBeenCalledWith({
          where: { id: 1 },
        });
        expect(mockArtickleRepository.update).toHaveBeenCalledWith(1, {
          title: dto.title,
          description: dto.description,
          createdAt: expect.any(String),
          author: artickle.author,
        });
        expect(mockCacheManager.del).toHaveBeenCalledWith('all_artickles');
        expect(result).toBe(true);
      });
    });

    describe('getArticklesById', () => {
      it('вернуть статью ихз кэша', async () => {
        const cachedArtickle = {
          id: 1,
          title: 'Cached Title',
          description: 'Cached Description',
          author: { id: 1, name: 'Cached Author' },
          createdAt: '2022-01-01T00:00:00Z',
        };
        mockCacheManager.get.mockResolvedValue(cachedArtickle);

        const result = await service.getArticklesById(1);

        expect(mockCacheManager.get).toHaveBeenCalledWith('artickle_1');
        expect(result).toEqual(cachedArtickle);
      });

      it('вернуть статью', async () => {
        const repoArtickle = {
          id: 1,
          title: 'Repo Title',
          description: 'Repo Description',
          author: { id: 1, name: 'Repo Author' },
          createdAt: '2022-01-01T00:00:00Z',
        };
        mockCacheManager.get.mockResolvedValue(undefined);
        mockArtickleRepository.findOne.mockResolvedValue(repoArtickle);
        mockCacheManager.set.mockResolvedValue(undefined);

        const result = await service.getArticklesById(1);

        expect(mockCacheManager.get).toHaveBeenCalledWith('artickle_1');
        expect(mockArtickleRepository.findOne).toHaveBeenCalledWith({
          where: { id: 1 },
          relations: ['author'],
        });
        expect(mockCacheManager.set).toHaveBeenCalledWith(
          'artickle_1',
          repoArtickle,
          300,
        );
        expect(result).toEqual(repoArtickle);
      });

      it('кинуть ошибку 404 если статья не найдена', async () => {
        mockCacheManager.get.mockResolvedValue(undefined);
        mockArtickleRepository.findOne.mockResolvedValue(undefined);

        await expect(service.getArticklesById(1)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('deleteArticklesById', () => {
      it('удалить статью и зачистить кэш', async () => {
        mockArtickleRepository.delete.mockResolvedValue({ affected: 1 });
        mockCacheManager.del.mockResolvedValue(undefined);

        const result = await service.deleteArticklesById(1);

        expect(mockArtickleRepository.delete).toHaveBeenCalledWith(1);
        expect(mockCacheManager.del).toHaveBeenCalledWith('all_artickles');
        expect(result).toBe(true);
      });

      it('выкинуть 404 если статья не найдена', async () => {
        mockArtickleRepository.delete.mockResolvedValue({ affected: 0 });

        await expect(service.deleteArticklesById(1)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('updateArtickleById', () => {
      it('should update an article and clear cache', async () => {
        const dto: UpdateArtickleDto = {
          title: 'Updated Title',
          description: 'Updated Description',
          createdAt: '',
        };
        const artickle = {
          id: 1,
          title: 'Old Title',
          description: 'Old Description',
          author: { id: 1, name: 'Author' },
          createdAt: '2022-01-01T00:00:00Z',
        };

        mockArtickleRepository.findOne.mockResolvedValue(artickle);
        mockArtickleRepository.update.mockResolvedValue(undefined);
        mockCacheManager.del.mockResolvedValue(undefined);

        const result = await service.updateArtickleById(1, dto);

        expect(mockArtickleRepository.findOne).toHaveBeenCalledWith({
          where: { id: 1 },
        });
        expect(mockArtickleRepository.update).toHaveBeenCalledWith(1, {
          title: dto.title,
          description: dto.description,
          createdAt: expect.any(String),
          author: artickle.author,
        });
        expect(mockCacheManager.del).toHaveBeenCalledWith('all_artickles');
        expect(result).toBe(true);
      });
    });
  });
});
