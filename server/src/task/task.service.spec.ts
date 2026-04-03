import { Test } from '@nestjs/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma.service';
import { TaskStatus, TaskPriority } from '../generated/prisma/client';

const mockTask = {
  id: 'id-123',
  title: 'task 1',
  description: 'description',
  status: TaskStatus.TODO,
  priority: TaskPriority.HIGH,
  dueDate: new Date('2026-04-10'),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  task: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
};

describe('TaskService', () => {
  let service: TaskService;
  let userId: string = "user1"

  beforeEach(async () => {
    vi.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      mockPrisma.task.create.mockResolvedValue(mockTask);
      const dto = {
        title: 'task 1',
        description: 'description',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        dueDate: new Date('2026-04-10'),
      };

      const result = await service.create(dto, userId);

      expect(mockPrisma.task.create).toHaveBeenCalledWith({ data: {...dto, userId} });
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll', () => {
    it('should return paginated tasks with meta for page 1', async () => {
      mockPrisma.task.findMany.mockResolvedValue([mockTask]);
      mockPrisma.task.count.mockResolvedValue(25);
      const pagination = { page: 1, limit: 10, skip: 0 };

      const result = await service.findAll(userId, pagination as any);

      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        where: { userId },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      expect(mockPrisma.task.count).toHaveBeenCalledWith({ where: { userId } });
      expect(result).toEqual({
        data: [mockTask],
        meta: {
          total: 25,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNextPage: true,
          hasPrevPage: false,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(mockTask);

      const result = await service.findOne('id-123', userId);

      expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({ where: { id: 'id-123', userId } });
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      await expect(service.findOne('bad-id', userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updated = { ...mockTask, title: 'task 12' };
      mockPrisma.task.findUnique.mockResolvedValue(mockTask);
      mockPrisma.task.update.mockResolvedValue(updated);

      const result = await service.update('id-123', { title: 'task 12' }, userId);

      expect(mockPrisma.task.update).toHaveBeenCalledWith({
        where: { id: 'id-123', userId },
        data: { title: 'task 12' },
      });
      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      await expect(service.update('bad-id', { title: 'x' }, userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(mockTask);
      mockPrisma.task.delete.mockResolvedValue(mockTask);

      const result = await service.remove('id-123', userId);

      expect(mockPrisma.task.delete).toHaveBeenCalledWith({ where: { id: 'id-123', userId } });
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      await expect(service.remove('bad-id', userId)).rejects.toThrow(NotFoundException);
    });
  });
});
