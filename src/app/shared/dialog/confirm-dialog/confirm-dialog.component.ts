import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogModel } from './confirm-dialog.model';

const modules = [
  MatDialogModule,
  MatButtonModule
];

/**
 * Confirmation dialog component
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    ...modules
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {

  readonly data = inject<ConfirmDialogModel>(MAT_DIALOG_DATA);

}
