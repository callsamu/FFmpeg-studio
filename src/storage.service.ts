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
  ) {}

  asObservable(): Observable<string[]> {
    return this.subject.asObservable();
  }

  save(name: string, script: string) {
    localStorage.setItem(name, script);

    this.messageService.setMessage({
      content: `Sucessfully saved: ${name}`,
      type: MessageType.Info,
    })

    this.subject.next(this.list());
  }

  fetch(name: string): string | null {
    return localStorage.getItem(name);
  }

  private list(): string[] {
    const names: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) names.push(key);
    }
    return names;
  }
}
