import { Test } from '@nestjs/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  login: vi.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    vi.clearAllMocks();
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();
    controller = module.get(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', async () => {
      mockAuthService.login.mockResolvedValue({ access_token: 'signed_token' });
      const req = { user: { id: 'user-1', email: 'john@example.com' } };

      const result = await controller.login(req);

      expect(mockAuthService.login).toHaveBeenCalledWith(req.user);
      expect(result).toEqual({ access_token: 'signed_token' });
    });
  });
});
