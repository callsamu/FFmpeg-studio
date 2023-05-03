import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject } from 'rxjs';
import { MessageType } from '../message';
import { MessageService } from '../message.service';

import { MessageComponent } from './message.component';

const message = {
  type: MessageType.Info,
  content: 'foo',
};

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;

  beforeEach(async () => {

    const messageSpy = jasmine.createSpyObj('MessageService', {
      observable: new BehaviorSubject(message),
    });

    await TestBed.configureTestingModule({
      declarations: [ MessageComponent ],
      imports: [
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        MatIconModule,
      ],
      providers: [
        { provide: MessageService, useValue: messageSpy },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive messages', () => {
    expect(component.message).toEqual(message);
  });
});
