import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../users/dto/create.user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../users/users.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let usersService: UsersService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;

  const mockUsersService = {
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'test-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('должен быть', () => {
    expect(service).toBeDefined();
  });

  describe('registration', () => {
    it('вернуть токен и юзера при регистрации', async () => {
      const dto: CreateUserDto = {
        email: 'test@test.com',
        password: 'test',
        name: 'Test',
      };
      const hashPassword = await bcrypt.hash(dto.password, 10);
      const user = { ...dto, id: 1, password: hashPassword } as User;

      mockUsersService.getUserByEmail.mockResolvedValue(null);
      mockUsersService.createUser.mockResolvedValue(user);

      const result = await service.registration(dto);

      expect(mockUsersService.getUserByEmail).toHaveBeenCalledWith(dto.email);
      expect(mockUsersService.createUser).toHaveBeenCalledWith({
        ...dto,
        password: expect.any(String),
      });
      expect(result).toEqual({ token: 'test-token' });
    });

    it('выкинуть ошибку если юзер екзист', async () => {
      const dto: CreateUserDto = {
        email: 'test@test.com',
        password: 'test',
        name: 'Test',
      };
      const user = { ...dto, id: 1, password: 'hashedPassword' } as User;

      mockUsersService.getUserByEmail.mockResolvedValue(user);

      await expect(service.registration(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('залогинится вернуть токен', async () => {
      const dto: CreateUserDto = {
        email: 'test@test.com',
        password: 'test',
        name: 'Test',
      };
      const hashPassword = await bcrypt.hash(dto.password, 10);
      const user = { ...dto, id: 1, password: hashPassword } as User;

      mockUsersService.getUserByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.login(dto);

      expect(mockUsersService.getUserByEmail).toHaveBeenCalledWith(dto.email);
      expect(result).toEqual({ token: 'test-token' });
    });

    it('выкинуть ошибку если емайл нет в бд', async () => {
      const dto: CreateUserDto = {
        email: 'test@test.com',
        password: 'test',
        name: 'Test',
      };

      mockUsersService.getUserByEmail.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('выкинуть ошибку если пароль не тот', async () => {
      const dto: CreateUserDto = {
        email: 'test@test.com',
        password: 'test',
        name: 'Test',
      };
      const user = { ...dto, id: 1, password: 'hashedPassword' } as User;

      mockUsersService.getUserByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('проверитт бади для юзера', async () => {
      const dto: CreateUserDto = {
        email: 'test@test.com',
        password: 'test',
        name: 'Test',
      };
      const hashPassword = await bcrypt.hash(dto.password, 10);
      const user = { ...dto, id: 1, password: hashPassword } as User;

      mockUsersService.getUserByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser(dto);

      expect(mockUsersService.getUserByEmail).toHaveBeenCalledWith(dto.email);
      expect(result).toEqual(user);
    });

    it('выкинуть ошибку если емайл нет в бд', async () => {
      const dto: CreateUserDto = {
        email: 'test@test.com',
        password: 'test',
        name: 'Test',
      };

      mockUsersService.getUserByEmail.mockResolvedValue(null);

      await expect(service.validateUser(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('выкинуть ошибку если пароль не тот', async () => {
      const dto: CreateUserDto = {
        email: 'test@test.com',
        password: 'test',
        name: 'Test',
      };
      const user = { ...dto, id: 1, password: 'hashedPassword' } as User;

      mockUsersService.getUserByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.validateUser(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
