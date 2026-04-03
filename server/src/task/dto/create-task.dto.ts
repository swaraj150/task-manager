import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus, TaskPriority } from '../../generated/prisma/client';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  status!: TaskStatus;

  @IsEnum(TaskPriority)
  priority!: TaskPriority;

  @IsDate()
  @Type(() => Date)
  dueDate!: Date;
}
