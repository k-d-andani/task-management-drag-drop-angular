export enum TaskStatusEnum {
  TODO,
  INPROGRESS,
  COMPLETED
}

export const TASK_STATUS_MAP: Record<TaskStatusEnum, string> = {
  [TaskStatusEnum.TODO]: 'Todo',
  [TaskStatusEnum.INPROGRESS]: 'Inprogress',
  [TaskStatusEnum.COMPLETED]: 'Completed',
}