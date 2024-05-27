import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User, UserViewModel } from './users.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create.user.dto';

describe('UsersService', () => {
  let service: UsersService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userRepository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('создать и сохранить в бд', async () => {
      const dto: CreateUserDto = {
        email: 'test@test.com',
        password: 'test',
        name: 'Test',
      };
      const user = { ...dto, id: 1 } as User;

      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.createUser(dto);

      expect(mockUserRepository.create).toHaveBeenCalledWith(dto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe('getAllUsers', () => {
    it('вернуть всех юзеров', async () => {
      const users: UserViewModel[] = [
        {
          id: 1,
          name: 'Test1',
          email: 'test1@test.com',
        },
        {
          id: 2,
          name: 'Test2',
          email: 'test2@test.com',
        },
      ];

      const expectedUsers: UserViewModel[] = [
        { id: 1, name: 'Test1', email: 'test1@test.com' },
        { id: 2, name: 'Test2', email: 'test2@test.com' },
      ];

      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.getAllUsers();

      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedUsers);
    });
  });

  describe('вернуть по емайл юзера', () => {
    it('вернуть по емайл юзера', async () => {
      const email = 'test@test.com';
      const user = { id: 1, name: 'Test', email, password: 'password' } as User;

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.getUserByEmail(email);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(user);
    });
  });
});
