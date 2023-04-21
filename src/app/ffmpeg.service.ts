import { Injectable } from '@angular/core';
import { createFFmpeg, FFmpeg } from '@ffmpeg/ffmpeg';
import { Observable, Observer, } from 'rxjs';
import { ArgsService } from './args.service';
import { MessageType } from './message';
import { MessageService } from './message.service';

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
  log = "";

  constructor(
    private argsService: ArgsService,
    private messageService: MessageService,
  ) {
    this.messageService.setMessage({
      content: "Loading FFmpeg...",
      type: MessageType.Load,
    });

    this.ffmpeg = createFFmpeg({ log: true });
    this.load();
  }

  load(): void {
    this.clearLog();

    this.ffmpeg.load().then(() => {
      this.messageService.setMessage({
        content: "FFmpeg is ready!",
        type: MessageType.Info,
      });
      this.clearLog();
      this.ready = true
    });
  }

  clearLog(): void {
    this.log = "";
  }

  async run(): Promise<void> {
    const args = this.argsService.getArgs();
    const files = this.argsService.getFiles();

    for (const [name, file] of files) {
      const ab = await file.arrayBuffer();
      const array = new Uint8Array(ab);
      this.ffmpeg.FS("writeFile", name, array);
      console.log(name);
    }

    if (!this.ready) {
      this.log += "ERROR: ffmpeg is not loaded";
      throw new Error("ffmpeg is not loaded");
    }

    this.running = true;
    await this.ffmpeg.run(...args);
    this.running = false;
  }

  progress(): Observable<number> {
    const ffmpeg = this.ffmpeg;

    return new Observable((observer: Observer<number>) => {
      ffmpeg.setProgress(x => observer.next(x.ratio * 100));
    });
  }

  whenItLogs(): Observable<void> {
    const ffmpeg = this.ffmpeg;

    return new Observable((observer: Observer<void>) => {
      ffmpeg.setLogger(log => {
        this.log += log.message + '\n';
        observer.next();
      });
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

  cancel(): void {
    this.running = false;
    this.ready = false;

    this.log += "\n\n\nExiting...";
    this.ffmpeg.exit();
  }
}
