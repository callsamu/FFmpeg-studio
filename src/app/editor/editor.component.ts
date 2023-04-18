import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FFmpegService } from '../ffmpeg.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {
  command = "ffmpeg";

  constructor(
    private ffmpegService: FFmpegService,
    private location: Location,
  ) {}

  run(): void {
    console.log("running ffmpeg:");

    const args = this.command
      .split(/\s|\n/)
      .filter(arg => arg !== "");

    console.log(args);
    this.location.go("run");
  }

  onFileSelected(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    let fileList = input.files;

    if (!fileList) return;

    for (let i = 0; i < fileList.length; i ++) {
      const file = fileList[i];
      this.command += file.name;
      this.ffmpegService.writeFile(file);
    }
  }
}
