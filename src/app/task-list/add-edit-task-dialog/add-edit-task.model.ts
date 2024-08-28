import { Task } from "../task.model";

export interface AddEditTaskDialogModel {
  isCreateMode: boolean;
  task?: Task
}