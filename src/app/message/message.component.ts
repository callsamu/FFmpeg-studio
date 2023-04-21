import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Message, MessageType } from '../message';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  animations: [
    trigger('write', [
      state('hidden', style({
        width: "0%",
      })),
      state('written', style({
        width: "100%",
      })),
      transition('hidden => written', [
        animate('5s')
      ]),
    ])
  ]
})

export class MessageComponent implements OnInit {
  message?: Message;
  changed = false;
  types = MessageType;

  constructor(
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.messageService.observable().subscribe(message => {
      this.changed = false;
      this.message = message;
      this.changed = true;
    })
  }
}
