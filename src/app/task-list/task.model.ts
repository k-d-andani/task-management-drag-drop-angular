import { TaskStatusEnum } from "./task-status.enum";

export interface Task {
  id: number;
  title: string;
  details: string;
  status: TaskStatusEnum;
}