import { TaskStatus, TaskPriority } from '../../../generated/prisma/client';

export class CreateTaskDto {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
}
