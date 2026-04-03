import { Test } from '@nestjs/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const mockUser = {
  id: 'user-1',
  name: 'abc',
  email: 'abc@example.com',
  password: 'hashed_password',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUserService = {
  create: vi.fn(),
  findAll: vi.fn(),
  findOne: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    vi.clearAllMocks();
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();
    controller = module.get(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      mockUserService.create.mockResolvedValue(mockUser);
      const dto = { name: 'abc', email: 'abc@example.com', password: 'password1' };

      const result = await controller.create(dto);

      expect(mockUserService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      mockUserService.findAll.mockResolvedValue([mockUser]);

      const result = await controller.findAll();

      expect(mockUserService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('user-1');

      expect(mockUserService.findOne).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updated = { ...mockUser, name: 'Jane Doe' };
      mockUserService.update.mockResolvedValue(updated);

      const result = await controller.update('user-1', { name: 'Jane Doe' });

      expect(mockUserService.update).toHaveBeenCalledWith('user-1', { name: 'Jane Doe' });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      mockUserService.remove.mockResolvedValue(mockUser);

      const result = await controller.remove('user-1');

      expect(mockUserService.remove).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockUser);
    });
  });
});
