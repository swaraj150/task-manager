import { Test } from '@nestjs/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskStatus, TaskPriority } from '../../generated/prisma/client';

const mockTask = {
  id: 'uuid-1',
  title: 'Test Task',
  description: 'A description',
  status: TaskStatus.TODO,
  priority: TaskPriority.HIGH,
  dueDate: new Date('2026-04-10'),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockTaskService = {
  create: vi.fn(),
  findAll: vi.fn(),
  findOne: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
};

describe('TaskController', () => {
  let controller: TaskController;
  let userId: string = "user1";

  beforeEach(async () => {
    vi.clearAllMocks();
    const module = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [{ provide: TaskService, useValue: mockTaskService }],
    }).compile();
    controller = module.get(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      mockTaskService.create.mockResolvedValue(mockTask);
      const dto = {
        title: 'Test Task',
        description: 'A description',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        dueDate: new Date('2026-04-10'),
      };

      const result = await controller.create(dto,userId);

      expect(mockTaskService.create).toHaveBeenCalledWith(dto,userId);
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      mockTaskService.findAll.mockResolvedValue([mockTask]);

      const result = await controller.findAll(userId);

      expect(mockTaskService.findAll).toHaveBeenCalledWith(userId);
      expect(result).toEqual([mockTask]);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      mockTaskService.findOne.mockResolvedValue(mockTask);

      const result = await controller.findOne('uuid-1',userId);

      expect(mockTaskService.findOne).toHaveBeenCalledWith('uuid-1',userId);
      expect(result).toEqual(mockTask);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updated = { ...mockTask, title: 'Updated' };
      mockTaskService.update.mockResolvedValue(updated);

      const result = await controller.update('uuid-1', { title: 'Updated' },userId);

      expect(mockTaskService.update).toHaveBeenCalledWith('uuid-1', { title: 'Updated' },userId);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      mockTaskService.remove.mockResolvedValue(mockTask);

      const result = await controller.remove('uuid-1',userId);

      expect(mockTaskService.remove).toHaveBeenCalledWith('uuid-1',userId);
      expect(result).toEqual(mockTask);
    });
  });
});
