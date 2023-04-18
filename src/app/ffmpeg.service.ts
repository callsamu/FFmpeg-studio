import { Injectable } from '@angular/core';
import { createFFmpeg, FFmpeg } from '@ffmpeg/ffmpeg';
import { bindCallback, map, Observable } from 'rxjs';

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
    const getObservable = bindCallback(this.ffmpeg.setProgress);
    return getObservable().pipe(map(x => x.ratio));
  }

  writeFile(file: File): void {
    file.arrayBuffer().then((ab: ArrayBuffer) => {
      const array = new Uint8Array(ab);
      this.ffmpeg.FS("writeFile", file.name, array);
    });
  }
}
