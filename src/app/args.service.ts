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

  setArgs(args: string[]) {
    this.args = args;
  }
}
