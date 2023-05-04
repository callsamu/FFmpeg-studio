import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Observable } from 'rxjs';
import { FFmpegService } from '../ffmpeg.service';

import { FFmpegProcessComponent } from './ffmpeg-process.component';

describe('FFmpegProcessComponent', () => {
  let component: FFmpegProcessComponent;
  let fixture: ComponentFixture<FFmpegProcessComponent>;
  let mockFFmpeg: jasmine.SpyObj<FFmpegService>;

  beforeEach(async () => {
    const mockFFmpeg = jasmine.createSpyObj('FFmpegService', {
      progress: new Observable<number>(),
      whenItLogs: new Observable<void>(),
      run: new Promise<void>(resolve => {
        console.log("running");
        resolve()
      }),
      output: "output",
    })
    await TestBed.configureTestingModule({
      declarations: [ FFmpegProcessComponent ],
      imports: [
        MatProgressBarModule,
        MatIconModule,
      ],
      providers: [
        { provide: FFmpegService, useValue: mockFFmpeg },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FFmpegProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('test init', fakeAsync(() => {
    expect(component).toBeTruthy();

    component.ngOnInit();
    tick();

    expect(mockFFmpeg.run).toHaveBeenCalled();
    expect(component.output).toBe("output");

  }));
});
