import { FFmpeg } from '@ffmpeg/ffmpeg';
import { Observable, Observer, } from 'rxjs';
import { ArgsService } from './args.service';
import { MessageType } from './message';
import { MessageService } from './message.service';

export type Log = {
  message: string;
  type: string;
}

export class FFmpegService {
  ready = false;
  running = false;
  done = false;

  log = "";

  constructor(
    private ffmpeg: FFmpeg,
    private argsService: ArgsService,
    private messageService: MessageService,
  ) {}

  load(): void {
    this.clearLog();

    this.messageService.setMessage({
      content: "Loading FFmpeg...",
      type: MessageType.Load,
    });

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
    const files = this.argsService.files;

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
    this.done = true;
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

  leave(): void {
    this.clearLog();
    this.done = false;
  }

  cancel(): void {
    this.running = false;
    this.ready = false;
    this.done = false;

    this.log += "\n\n\nExiting...";
    this.ffmpeg.exit();
  }
}
