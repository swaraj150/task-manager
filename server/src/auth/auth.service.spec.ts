import { Test } from '@nestjs/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

const mockUser = {
  id: 'user-1',
  name: 'abc',
  email: 'abc@def.com',
  password: 'hashed_password',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUserService = {
  findOneByEmail: vi.fn(),
  comparePassword: vi.fn(),
};

const mockJwtService = {
  sign: vi.fn().mockReturnValue('signed_token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    vi.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      mockUserService.findOneByEmail.mockResolvedValue(mockUser);
      mockUserService.comparePassword.mockResolvedValue(true);

      const result = await service.validateUser('abc@def.com', 'plaintext');

      const { password: _, ...expected } = mockUser;
      expect(result).toEqual(expected);
    });

    it('should throw BadRequestException when password does not match', async () => {
      mockUserService.findOneByEmail.mockResolvedValue(mockUser);
      mockUserService.comparePassword.mockResolvedValue(false);

      await expect(service.validateUser('abc@def.com', 'wrong')).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const { password: _, ...userWithoutPassword } = mockUser;

      const result = await service.login(userWithoutPassword);

      expect(mockJwtService.sign).toHaveBeenCalledWith({ email: mockUser.email, id: mockUser.id });
      expect(result).toEqual({ access_token: 'signed_token' });
    });
  });
});
