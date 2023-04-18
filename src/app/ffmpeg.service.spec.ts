import { TestBed } from '@angular/core/testing';

import { FFmpegService } from './ffmpeg.service';

describe('FFmpegService', () => {
  let service: FFmpegService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FFmpegService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
