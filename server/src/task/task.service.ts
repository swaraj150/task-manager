import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createTaskDto: CreateTaskDto) {
    return this.prismaService.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status,
        priority: createTaskDto.priority,
        dueDate: createTaskDto.dueDate,
      },
    });
  }

  findAll() {
    return this.prismaService.task.findMany();
  }

  async findOne(id: string) {
    const task = await this.prismaService.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id);
    return this.prismaService.task.update({ where: { id }, data: updateTaskDto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prismaService.task.delete({ where: { id } });
  }
}
