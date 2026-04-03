import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from 'src/auth/decorators/auth-user.decorator';
import { PaginationDto } from './dto/pagination.dto';

@Controller('task')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @AuthenticatedUser() userId:string) {
    return this.taskService.create(createTaskDto,userId);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto,@AuthenticatedUser() userId:string) {
    return this.taskService.findAll(userId,pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string,@AuthenticatedUser() userId:string) {
    return this.taskService.findOne(id,userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto,@AuthenticatedUser() userId:string) {
    return this.taskService.update(id, updateTaskDto,userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@AuthenticatedUser() userId:string) {
    return this.taskService.remove(id,userId);
  }
}
