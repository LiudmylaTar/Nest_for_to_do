import {
  Controller,
  UseGuards,
  Get,
  Req,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksDto } from './dto/get-tasks.dto';

@ApiTags('tasks')
@ApiBearerAuth('JWT-auth')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'List my tasks (filter, search, sort, pagination)' })
  async getMyTasks(@Req() req, @Query() query: GetTasksDto) {
    const userId = req.user.userId;

    return this.tasksService.findAllByUser(userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get one task by id' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  async getTaskById(@Req() req, @Param('id') taskId: string) {
    const userId = req.user.userId;

    return this.tasksService.findOne(userId, taskId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a task' })
  async createTask(@Req() req, @Body() dto: CreateTaskDto) {
    const userId = req.user.userId;

    return this.tasksService.createTask(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
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
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'MongoDB ObjectId' })
  async deleteTask(@Req() req, @Param('id') taskId: string) {
    const userId = req.user.userId;
    await this.tasksService.deleteTask(userId, taskId);
    return { message: `Task ${taskId} deleted successfully` };
  }
}
