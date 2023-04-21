import { Injectable } from '@angular/core';
import { createFFmpeg, FFmpeg } from '@ffmpeg/ffmpeg';
import { Observable, Observer, } from 'rxjs';
import { ArgsService } from './args.service';

export type Log = {
  message: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class FFmpegService {
  ffmpeg: FFmpeg;
  ready = false;
  running = false;

  constructor(private argsService: ArgsService) {
    this.ffmpeg = createFFmpeg({ log: true });
    this.ffmpeg.load().then(() => this.ready = true);
  }

  async run(): Promise<void> {
    if (this.running) return;
    this.running = false;

    const args = this.argsService.getArgs();
    const files = this.argsService.getFiles();

    for (const [name, file] of files) {
      const ab = await file.arrayBuffer();
      const array = new Uint8Array(ab);
      this.ffmpeg.FS("writeFile", name, array);
      console.log(name);
    }

    console.log(args, files);

    return this.ffmpeg.run(...args);
  }

  progress(): Observable<number> {
    const ffmpeg = this.ffmpeg;

    return new Observable((observer: Observer<number>) => {
      ffmpeg.setProgress(x => observer.next(x.ratio * 100));
    });
  }

  logs(): Observable<Log> {
    const ffmpeg = this.ffmpeg;

    return new Observable((observer: Observer<Log>) => {
      ffmpeg.setLogger(log => observer.next(log));
    });
  }

  writeFile(file: File): void {
    file.arrayBuffer().then((ab: ArrayBuffer) => {
      const array = new Uint8Array(ab);
      this.ffmpeg.FS("writeFile", file.name, array);
    });
  }

  output(): string | null {
    const output = this.argsService.output();
    if (!output) return null;


    const array = this.ffmpeg.FS("readFile", output);
    if (!array) return null;

    const split = output.split(".");
    const extension = split[split.length-1];

    return URL.createObjectURL(
      new Blob([array], {type: `video/${extension}`})
    );
  }

  async cancel(): Promise<void> {
    this.running = false;
    return this.ffmpeg.exit();
  }
}
