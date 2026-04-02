import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { isValidObjectId, Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async findAllByUser(userId: string) {
    return this.taskModel.find({ ownerId: userId });
  }
  // Створення задачі, прив'язаної до користувача (DTO (Data Transfer Object) )
  async createTask(userId: string, dto: CreateTaskDto) {
    const createdTask = new this.taskModel({
      ...dto,
      ownerId: userId,
    });

    return createdTask.save();
  }

  async updateTask(userId: string, taskId: string, dto: UpdateTaskDto) {
    try {
      const set: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(dto ?? {})) {
        if (value !== undefined) set[key] = value;
      }

      const updated = await this.taskModel.findOneAndUpdate(
        { _id: taskId, ownerId: userId },
        { $set: set },
        { new: true, runValidators: true },
      );

      if (!updated) {
        throw new NotFoundException('Task not found');
      }

      return updated;
    } catch (err: any) {
      // Map common Mongoose errors to proper HTTP responses.
      if (err?.name === 'CastError') {
        throw new BadRequestException('Invalid task id');
      }
      if (err?.name === 'ValidationError') {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }
  
  async deleteTask(userId: string, taskId: string) {
    if (!isValidObjectId(taskId)) {
      throw new BadRequestException('Invalid task id');
    }

    const deleted = await this.taskModel.findOneAndDelete({
      _id: taskId,
      ownerId: userId,
    });

    if (!deleted) {
      throw new NotFoundException('Task not found or not yours');
    }

    return deleted; // або просто `return;` для 204 No Content
  }
}
