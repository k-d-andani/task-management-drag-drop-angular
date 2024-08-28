import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Task } from '../task-list/task.model';

/**
 * Task service
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly _api = "api/tasks";

  constructor(
    private http: HttpClient,
  ) {}

  /**
   * Get tasks
   */
  getTasks(): Observable<Task[]> {
    return this.http
      .get<Task[]>(this._api)
      .pipe(catchError(this.handleError<Task[]>("getTasks", [])));
  }

  /**
   * Search task
   * @param term - term to search for task title
   */
  searchTasks(term: string): Observable<Task[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http
      .get<Task[]>(`${this._api}/?title=${term}`)
      .pipe(catchError(this.handleError<Task[]>("searchTasks", [])));
  }

  /**
   * Delete task
   * @param taskId - Task id
   */
  public deleteTask(taskId: number) {
    return this.http
      .delete(`${this._api}/${taskId}`)
      .pipe(catchError(this.handleError<Task[]>("deleteTask", [])));
  }

  /**
   * Add task
   * @param task - Task
   */
  public addTask(task: Task) {
    return this.http
      .post(this._api, task)
      .pipe(catchError(this.handleError<Task[]>("addTask", [])));
  }

  /**
   * Edit task
   * @param task - Task
   */
  public editTask(task: Task) {
    return this.http
      .put(`${this._api}/${task.id}`, task)
      .pipe(catchError(this.handleError<Task[]>("editTask", [])));
  }

  /**
   * Handle error
   * @param operation - Operation type
   * @param result - Result
   * @returns - Observable error
   */
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }
}
