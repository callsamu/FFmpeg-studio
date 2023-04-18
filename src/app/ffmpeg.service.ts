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

  constructor(private argsService: ArgsService) {
    this.ffmpeg = createFFmpeg({ log: true });
    this.ffmpeg.load().then(() => this.ready = true);
  }

  run(): Promise<void> {
    const args = this.argsService.getArgs();
    if (args && args[0] === "ffmpeg") args.shift();

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

  output(): string {
    const output = "output.mp4";

    const array = this.ffmpeg.FS("readFile", output);

    const split = output.split("");
    const extension = split[split.length-1];

    return URL.createObjectURL(
      new Blob([array], {type: `video/${extension}`})
    );
  }
}
