import { Injectable } from '@angular/core';
import { createFFmpeg, FFmpeg } from '@ffmpeg/ffmpeg';
import { bindCallback, map, Observable, observeOn, Observer, tap } from 'rxjs';

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

  constructor() {
    this.ffmpeg = createFFmpeg({ log: true });
    this.ffmpeg.load().then(() => this.ready = true);
  }

  run(args: string[]): void {
    if (args && args[0] === "ffmpeg") args.shift();
    this.ffmpeg.run(...args);
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
}
