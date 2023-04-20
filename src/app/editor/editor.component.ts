import { Component } from '@angular/core';
import { ArgsService } from '../args.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Change, ChangeType } from '../editor-change';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {
  command = "ffmpeg";
  cursorStart: number = 0;

  changes = new Subject<Change>();

  constructor(
    private argsService: ArgsService,
    private router: Router,
  ) {}

  run(): void {
    this.argsService.setArgs(this.command);
    this.router.navigateByUrl("run");
  }

  onFileSelected(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    let fileList = input.files;

    if (!fileList) return;

    for (let i = 0; i < fileList.length; i ++) {
      const file = fileList[i];

      this.changes.next({
        value: file.name,
        type: ChangeType.insertion,
      });

      this.argsService.addFile(file);
    }
  }
}
