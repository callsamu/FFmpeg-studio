import { Component, OnInit } from '@angular/core';
import { ArgsService } from '../args.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { EditorEvent, EditorEventType } from '../editor-event';
import { FFmpegService } from '../ffmpeg.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  command = "ffmpeg";
  cursorStart: number = 0;

  eventsToEditor = new Subject<EditorEvent>();

  constructor(
    private ffmpegService: FFmpegService,
    private argsService: ArgsService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (!this.ffmpegService.ready) {
      this.ffmpegService.load();
    }
  }

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

  undo(): void {
    this.eventsToEditor.next({
      type: EditorEventType.undo
    })
  }

  onFileSelected(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    let fileList = input.files;

    if (!fileList) return;

    for (let i = 0; i < fileList.length; i ++) {
      const file = fileList[i];

      const filename = file.name.search(/\s+/) > 0 ?
        `"${file.name}"` :
        file.name;

      this.eventsToEditor.next({
        value: filename,
        type: EditorEventType.insertion,
      });

      this.argsService.addFile(new File([file], filename));
    }
  }
}
