import { Injectable } from '@nestjs/common';
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

  findOne(id: string) {
    return this.prismaService.task.findUnique({ where: { id } });
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.prismaService.task.update({ where: { id }, data: updateTaskDto });
  }

  remove(id: string) {
    return this.prismaService.task.delete({ where: { id } });
  }
}
