import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageType } from './app/message';
import { MessageService } from './app/message.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private subject = new BehaviorSubject<string[]>(this.list());

  constructor(
    private messageService: MessageService,
    private storage: Storage,
  ) {}

  asObservable(): Observable<string[]> {
    return this.subject.asObservable();
  }

  save(name: string, script: string) {
    this.storage.setItem(name, script);

    this.messageService.setMessage({
      content: `Sucessfully saved: ${name}`,
      type: MessageType.Info,
    })

    this.subject.next(this.list());
  }

  fetch(name: string): string | null {
    return this.storage.getItem(name);
  }

  private list(): string[] {
    const names: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key) names.push(key);
    }
    return names;
  }
}
