import { Controller, UseGuards, Get, Req, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyTasks(@Req() req) {
    const userId = req.user.userId;

    return this.tasksService.findAllByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTask(@Req() req, @Body() dto: CreateTaskDto) {
    const userId = req.user.userId;

    return this.tasksService.createTask(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateTask(
    @Req() req,
    @Param('id') taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    const userId = req.user.userId;
    return this.tasksService.updateTask(userId, taskId, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTask(
    @Req() req,
    @Param('id') taskId: string,
  ) {
    const userId = req.user.userId;
     await this.tasksService.deleteTask(userId, taskId);
     return { message: `Task ${taskId} deleted successfully` };
}
}