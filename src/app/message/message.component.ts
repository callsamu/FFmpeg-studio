import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Message, MessageType } from '../message';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})

export class MessageComponent implements OnInit, AfterViewInit {
  message?: Message;
  types = MessageType;

  @ViewChild('span') span?: ElementRef;
  writeAnimation?: AnimationPlayer;

  constructor(
    private messageService: MessageService,
    private animationBuilder: AnimationBuilder,
  ) {}

  ngOnInit(): void {
    this.messageService.observable().subscribe(message => {
      this.message = message;

      if (!this.writeAnimation) return;
      this.writeAnimation.play();
    })
  }

  ngAfterViewInit(): void {
    if (!this.span) return;

    const animation = this.animationBuilder.build([
      style({ width: "0" }),
      animate('2s', style({ width: '100%'}))
    ])

    this.writeAnimation = animation.create(this.span.nativeElement);
  }
}
