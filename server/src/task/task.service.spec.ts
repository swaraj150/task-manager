import { Test } from '@nestjs/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskService } from './task.service';
import { PrismaService } from 'src/prisma.service';
import { TaskStatus, TaskPriority } from '../../generated/prisma/client';

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
  },
};

describe('TaskService', () => {
  let service: TaskService;

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

      const result = await service.create(dto);

      expect(mockPrisma.task.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      mockPrisma.task.findMany.mockResolvedValue([mockTask]);

      const result = await service.findAll();

      expect(mockPrisma.task.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockTask]);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(mockTask);

      const result = await service.findOne('id-123');

      expect(mockPrisma.task.findUnique).toHaveBeenCalledWith({ where: { id: 'id-123' } });
      expect(result).toEqual(mockTask);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updated = { ...mockTask, title: 'task 12' };
      mockPrisma.task.update.mockResolvedValue(updated);

      const result = await service.update('id-123', { title: 'task 12' });

      expect(mockPrisma.task.update).toHaveBeenCalledWith({
        where: { id: 'id-123' },
        data: { title: 'task 12' },
      });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      mockPrisma.task.delete.mockResolvedValue(mockTask);

      const result = await service.remove('id-123');

      expect(mockPrisma.task.delete).toHaveBeenCalledWith({ where: { id: 'id-123' } });
      expect(result).toEqual(mockTask);
    });
  });
});
