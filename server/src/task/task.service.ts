import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma.service';

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

  findAll(userId: string) {
    return this.prismaService.task.findMany({
      where: {
        userId,
      }
    });
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
