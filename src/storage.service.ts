import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private subject = new BehaviorSubject<string[]>(this.list());

  constructor() {
    window.onstorage = () => {
      this.subject.next(this.list())
    };
  }

  asObservable(): Observable<string[]> {
    return this.subject.asObservable();
  }

  save(name: string, script: string) {
    localStorage.setItem(name, script);
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
