import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TaskPriority,  TaskStatus } from '../task-status.enum';


@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({
    enum: Object.values(TaskStatus),
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;
  @Prop({
    enum: Object.values(TaskPriority),
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Prop({ required: true })
  ownerId: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
export type TaskDocument = Task & Document;
