import { Component } from '@angular/core';
import { FFmpegService } from '../ffmpeg.service';
import { ArgsService } from '../args.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {
  command = "ffmpeg";
  cursorStart: number = 0;

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

      const before = this.command.slice(0, this.cursorStart);
      const after = this.command.slice(this.cursorStart);
      this.command = before + `"${file.name}"` + after;

      this.argsService.addFile(file);
    }
  }
}
