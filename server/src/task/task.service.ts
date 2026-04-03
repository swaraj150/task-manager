import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma.service';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) { }

  create(createTaskDto: CreateTaskDto, userId: string) {
    return this.prismaService.task.create({
      data: {
        ...createTaskDto,
        userId: userId,

      },
    });
  }

  async findAll(userId: string, pagination: PaginationDto) {
    const { skip, limit, page } = pagination;

    const [tasks, total] = await Promise.all([
      this.prismaService.task.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.task.count({
        where: { userId },
      }),
    ]);

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string, userId: string) {
    const task = await this.prismaService.task.findUnique({ where: { id, userId } });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    await this.findOne(id, userId);
    return this.prismaService.task.update({ where: { id, userId }, data: updateTaskDto });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prismaService.task.delete({ where: { id, userId } });
  }
}
