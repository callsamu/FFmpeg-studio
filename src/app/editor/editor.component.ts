import { Component } from '@angular/core';
import { ArgsService } from '../args.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { EditorEvent, EditorEventType } from '../editor-event';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {
  command = "ffmpeg";
  cursorStart: number = 0;

  eventsToEditor = new Subject<EditorEvent>();

  constructor(
    private argsService: ArgsService,
    private router: Router,
  ) {}

  run(): void {
    this.eventsToEditor.next({
      type: EditorEventType.retrieval
    });

    console.log(this.command);
    const command = this.command;
    setTimeout(() => console.log(command), 3000);
    this.argsService.setArgs(this.command);
    this.router.navigateByUrl("run");
  }

  onFileSelected(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    let fileList = input.files;

    if (!fileList) return;

    for (let i = 0; i < fileList.length; i ++) {
      const file = fileList[i];

      this.eventsToEditor.next({
        value: file.name,
        type: EditorEventType.insertion,
      });

      this.argsService.addFile(file);
    }
  }
}
