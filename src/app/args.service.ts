import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArgsService {
  args: string[] = [];

  constructor() { }

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
}
