import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Message } from './message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages = new Subject<Message>;

  constructor() { }

  observable(): Observable<Message> {
    return this.messages.asObservable();
  }

  setMessage(message: Message) {
    this.messages.next(message);
  }
}
