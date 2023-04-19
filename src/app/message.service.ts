import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  message?: string;

  constructor() { }

  setMessage(message: string, type?: string) {
    this.message = message;
  }
}
