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
import { GetTasksDto } from './dto/get-tasks.dto';
import { TaskSortField } from './task-status.enum';

/** Literal substring search: strip regex metacharacters so user input is not treated as a pattern. */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async findAllByUser(userId: string, query: GetTasksDto) {
    const { status, priority, search, sortBy, sortOrder, page, limit } = query;
    const filter: any = { ownerId: userId };

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    const trimmedSearch = search?.trim();
    if (trimmedSearch) {
      const safe = escapeRegExp(trimmedSearch);
      filter.$or = [
        { title: { $regex: safe, $options: 'i' } },
        { description: { $regex: safe, $options: 'i' } },
      ];
    }
    const sortDirection: 1 | -1 = sortOrder === 'desc' ? -1 : 1;
    const skip = (page - 1) * limit;
    const totalPromise = this.taskModel.countDocuments(filter);

    const tasksPromise =
      sortBy === TaskSortField.PRIORITY
        ? this.taskModel.aggregate([
            { $match: filter },
            {
              $addFields: {
                priorityRank: {
                  $switch: {
                    branches: [
                      { case: { $eq: ['$priority', 'high'] }, then: 4 },
                      { case: { $eq: ['$priority', 'important'] }, then: 3 },
                      { case: { $eq: ['$priority', 'medium'] }, then: 2 },
                      { case: { $eq: ['$priority', 'low'] }, then: 1 },
                    ],
                    default: 0,
                  },
                },
              },
            },
            { $sort: { priorityRank: sortDirection, createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            { $project: { priorityRank: 0 } },
          ])
        : this.taskModel
            .find(filter)
            .sort(sortBy ? { [sortBy]: sortDirection } : { createdAt: -1 })
            .skip(skip)
            .limit(limit);

    const [tasks, total] = await Promise.all([tasksPromise, totalPromise]);

    return {
      data: tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  // Створення задачі, прив'язаної до користувача (DTO (Data Transfer Object) )
  async createTask(userId: string, dto: CreateTaskDto) {
    const createdTask = new this.taskModel({
      ...dto,
      ownerId: userId,
    });

    return createdTask.save();
  }

  async findOne(userId: string, taskId: string) {
  if (!isValidObjectId(taskId)) {
    throw new BadRequestException('Invalid task id');
  }

  const task = await this.taskModel.findOne({
    _id: taskId,
    ownerId: userId,
  });

  if (!task) {
    throw new NotFoundException('Task not found');
  }

  return task;
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
