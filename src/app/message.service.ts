import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, Observable, tap } from 'rxjs';
import { Message, MessageType } from './message';

const initMessage = {
  content: "Welcome to FFmpeg Studio!",
  type: MessageType.Info,
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages = new BehaviorSubject<Message>(initMessage);

  constructor() {}

  observable(): Observable<Message> {
    return this.messages.asObservable().pipe(
      tap(x => console.log(x)),
      debounceTime(100)
    );
  }

  setMessage(message: Message) {
    this.messages.next(message);
  }
}
