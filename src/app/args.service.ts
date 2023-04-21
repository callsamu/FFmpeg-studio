import { Injectable } from '@angular/core';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ArgsService {
  args: string[] = [];
  files = new Map<string, File>();

  constructor(
    private messageService: MessageService,
  ) {}

  getArgs(): string[] {
    return this.args;
  }

  setArgs(argString: string) {
    const args = argString
      .split(/\s|\n/)
      .filter(arg => arg !== "");

    if (args && args[0] === "ffmpeg") args.shift();
    this.args = args;
    console.log(this.args);
  }

  addFile(file: File) {
    this.files.set(file.name, file);
    this.messageService.setMessage(`Successfully uploaded: ${file.name}`);
  }

  getFiles(): Map<string, File> {
    return this.files;
  }

  output(): string | undefined {
    return this.args ?
      this.args[this.args.length-1] :
      undefined;
  }
}
