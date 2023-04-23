import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-file-dialog',
  templateUrl: './file-dialog.component.html',
  styleUrls: ['./file-dialog.component.scss']
})
export class FileDialogComponent {
  value?: string;

  constructor (
    @Inject(MAT_DIALOG_DATA) public data: { files: string[] },
    public dialogRefService: MatDialogRef<FileDialogComponent>,
  ) {}

  close(file?: string) {
    this.dialogRefService.close(file);
  }
}
