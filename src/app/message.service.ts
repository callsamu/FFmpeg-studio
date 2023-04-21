import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from './message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages = new Subject<Message>;

  constructor() { }

  subscribe(fn: (message: Message) => void): void {
    this.messages.subscribe(fn);
  }

  setMessage(message: string, type?: string) {
    this.messages.next({
      content: message,
      type: type ?? "info",
    });
  }
}
