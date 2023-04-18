import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FFmpegProcessComponent } from './ffmpeg-process.component';

describe('FFmpegProcessComponent', () => {
  let component: FFmpegProcessComponent;
  let fixture: ComponentFixture<FFmpegProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FFmpegProcessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FFmpegProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
