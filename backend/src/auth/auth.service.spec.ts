import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      create: jest.fn().mockImplementation((dto) =>
        Promise.resolve({ id: 1, ...dto }),
      ),
      findByEmail: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('debe registrar un usuario con contraseña encriptada', async () => {
      const dto = { name: 'Test', email: 'test@test.com', password: '123456' };
      const result = await authService.register(dto);

      expect(usersService.create).toHaveBeenCalled();
      const calledWith = (usersService.create as jest.Mock).mock.calls[0][0];
      expect(calledWith.email).toBe(dto.email);
      expect(calledWith.password).not.toBe(dto.password);

      const isMatch = await bcrypt.compare(dto.password, calledWith.password);
      expect(isMatch).toBe(true);
    });
  });

  describe('login', () => {
    it('debe devolver access_token con credenciales válidas', async () => {
      const hashedPassword = await bcrypt.hash('123456', 10);
      (usersService.findByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: hashedPassword,
      });

      const result = await authService.login('test@test.com', '123456');
      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toBe('mock-jwt-token');
    });

    it('debe lanzar error con credenciales inválidas', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login('fake@test.com', 'wrong'),
      ).rejects.toThrow();
    });
  });
});
