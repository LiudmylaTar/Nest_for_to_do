import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  SortOrder,
  TaskPriority,
  TaskSortField,
  TaskStatus,
} from '../task-status.enum';

export class GetTasksDto {
  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Case-insensitive substring on title / description',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50) // caps regex cost / payload size for list search
  search?: string;

  @ApiPropertyOptional({ enum: TaskSortField })
  @IsOptional()
  @IsEnum(TaskSortField)
  sortBy?: TaskSortField;

  @ApiPropertyOptional({ enum: SortOrder })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // щоб не валили сервер великими лімітами
  limit: number = 10;
}