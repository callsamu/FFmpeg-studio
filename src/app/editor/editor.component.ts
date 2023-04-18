import { Component } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {
  command = "ffmpeg";
  files: File[] = [];

  run(): void {
    console.log("running ffmpeg:");
    console.log(this.files.map(file => file.name));

    const args = this.command
      .split(/\s|\n/)
      .filter(arg => arg !== "");

    console.log(args);
  }

  onFileSelected(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    let fileList = input.files;

    if (fileList) {
      for (let i = 0; i < fileList.length; i ++) {
        const file = fileList[i];
        this.command += " " + file.name;
        this.files.push(fileList[i]);
      }
    }
  }
}
