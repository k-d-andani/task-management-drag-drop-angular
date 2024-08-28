import { CommonModule, KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TASK_STATUS_MAP } from '../task-status.enum';
import { AddEditTaskDialogModel } from './add-edit-task.model';

const modules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MatDialogModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule
];

const pipes = [
  KeyValuePipe
];

export interface AddEditTaskFormModel {
  title: FormControl<string | null>;
  details: FormControl<string | null>;
  status: FormControl<any | null>;
}

/**
 * Add or edit task dialog component
 */
@Component({
  selector: 'app-add-edit-task-dialog',
  standalone: true,
  imports: [
    ...modules,
    ...pipes
  ],
  templateUrl: './add-edit-task-dialog.component.html',
  styleUrl: './add-edit-task-dialog.component.scss'
})
export class AddEditTaskDialogComponent {

  readonly dialogRef = inject(MatDialogRef<AddEditTaskDialogComponent>);
  readonly data = inject<AddEditTaskDialogModel>(MAT_DIALOG_DATA);

  readonly TASK_STATUS_MAP = TASK_STATUS_MAP;

  public addEditTaskForm!: FormGroup<AddEditTaskFormModel>;

  constructor(
    private _fb: FormBuilder
  ) {
    this.addEditTaskForm = this._fb.group({
      title: new FormControl<string | null>(null, Validators.required),
      details: new FormControl<string | null>(null, Validators.required),
      status: new FormControl<string | null>(null, Validators.required)
    });

    if (!this.data.isCreateMode) {
      const status: string = `${this.data?.task?.status}`;
      this.addEditTaskForm.patchValue({ ...this.data.task, status });
    }
  }

  /**
   * Add or edit task
   */
  public addEditTask(): void {
    this.addEditTaskForm.markAllAsTouched();

    if (this.addEditTaskForm.valid) {
      const taskDetails = this.addEditTaskForm.getRawValue();

      this.dialogRef.close(
        this.data.isCreateMode ? taskDetails : { ...taskDetails, id: this.data.task?.id }
      );
    }
  }
}
