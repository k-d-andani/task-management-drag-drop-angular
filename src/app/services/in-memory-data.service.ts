import { Injectable } from '@angular/core';
import { TaskStatusEnum } from '../task-list/task-status.enum';
import { Task } from '../task-list/task.model';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService {

  constructor() {}

  createDb() {

    const tasks: Task[] = Array(10).fill(0).map((_, index) => ({
      id: index + 1,
      title: `Task ${index + 1}`,
      details: `Details ${index + 1}`,
      status: index % 2 === 0 ? TaskStatusEnum.TODO : TaskStatusEnum.INPROGRESS
    }));

    return { tasks };
  }
}
