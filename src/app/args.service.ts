import { Injectable } from '@angular/core';
import { MessageType } from './message';
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
      .match(/("[^"]+"|[^"\s]+)/g);

    if (args && args[0] === "ffmpeg") {
      args.shift();
      this.args = args as string[];
    }
  }

  addFile(file: File) {
    this.files.set(file.name, file);
    this.messageService.setMessage({
      content: `Successfully uploaded: ${file.name}`,
      type: MessageType.Info,
    });
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
