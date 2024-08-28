import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { HotToastService } from '@ngxpert/hot-toast';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Subject, takeUntil } from 'rxjs';
import { TaskService } from '../services/task.service';
import { ConfirmDialogComponent } from '../shared/dialog/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel } from '../shared/dialog/confirm-dialog/confirm-dialog.model';
import { AddEditTaskDialogComponent } from './add-edit-task-dialog/add-edit-task-dialog.component';
import { AddEditTaskDialogModel } from './add-edit-task-dialog/add-edit-task.model';
import { TaskStatusEnum } from './task-status.enum';
import { Task } from './task.model';

const modules = [
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  NgxSkeletonLoaderModule,
]

/**
 * Task list component
 */
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    ...modules
  ]
})
export class TaskListComponent implements OnInit, OnDestroy {

  public isLoading: boolean = true;

  public readonly skeletonConfig = {
    'border-radius': '5px',
    height: '50px'
  };

  public todoTasks: Task[] = [];
  public inProgressTasks: Task[] = [];
  public completedTasks: Task[] = [];

  private readonly _dialog = inject(MatDialog);

  private _destroy$ = new Subject();

  constructor(
    private _taskService: TaskService,
    private _toast: HotToastService
  ) {}

  public ngOnInit(): void {
    this.getTasks();
  }

  public ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  /**
   * Drop
   * @param event - Drag and drop event
   */
  public drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  /**
   * Get tasks
   */
  public getTasks(): void {
    this.isLoading = true;

    this._taskService.getTasks()
      .pipe(
        takeUntil(this._destroy$)
      ).subscribe(taskResponse => {
        this.todoTasks = taskResponse.filter(task => task.status === TaskStatusEnum.TODO);
        this.inProgressTasks = taskResponse.filter(task => task.status === TaskStatusEnum.INPROGRESS);
        this.completedTasks = taskResponse.filter(task => task.status === TaskStatusEnum.COMPLETED);

        this.isLoading = false;
      })
  }

  /**
   * Delete task
   * @param task - Task
   */
  public deleteTask(task: Task): void {
    const dialogData: ConfirmDialogModel = {
      title: "Are you sure?",
      content: `Do you want to delete task - ${task.title}`,
      yesButtonLabel: "Delete",
      cancelButtonLabel: "Cancel"
    }

    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {
          this.isLoading = true;

          this._taskService.deleteTask(task.id)
            .pipe(
              takeUntil(this._destroy$)
            ).subscribe(deleteResponse => {
              this._toast.success(`${task.title} deleted.`)
              this.getTasks();
            });
        }
      });
  }

  /**
   * Add Task
   */
  public addTask(): void {
    const dialogData: AddEditTaskDialogModel = {
      isCreateMode: true
    }

    const dialogRef = this._dialog.open(AddEditTaskDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed()
      .subscribe(taskDetails => {
        if (taskDetails) {
          taskDetails.status = Number(taskDetails.status);
          this.isLoading = true;

          this._taskService.addTask(taskDetails)
            .pipe(
              takeUntil(this._destroy$)
            ).subscribe(addResponse => {
              this._toast.success(`${taskDetails.title} added.`)
              this.getTasks();
            });
        }
      });
  }

  /**
   * Edit Task
   * @param task - Task
   */
  public editTask(task: Task): void {
    const dialogData: AddEditTaskDialogModel = {
      isCreateMode: false,
      task
    }

    const dialogRef = this._dialog.open(AddEditTaskDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed()
      .subscribe(taskDetails => {
        if (taskDetails) {
          taskDetails.status = Number(taskDetails.status);

          this.isLoading = true;

          this._taskService.editTask(taskDetails)
            .pipe(
              takeUntil(this._destroy$)
            ).subscribe(editResponse => {
              this._toast.success(`${taskDetails.title} updated.`)
              this.getTasks();
            });
        }
      });
  }
}
