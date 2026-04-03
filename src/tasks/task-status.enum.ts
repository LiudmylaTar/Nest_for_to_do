export enum TaskStatus {
  PENDING = 'pending',      // ще не почата
  IN_PROGRESS = 'in progress',
  DONE = 'done',
}
export enum TaskPriority {
  HIGH = 'high',
  IMPORTANT = 'important',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

/** Allowed `sortBy` query values — must match fields used in TasksService.sort(). */
export enum TaskSortField {
  TITLE = 'title',
  STATUS = 'status',
  PRIORITY = 'priority',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}