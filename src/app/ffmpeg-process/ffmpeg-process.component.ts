import { Component, ElementRef, ViewChild } from '@angular/core';
import { FFmpegService } from '../ffmpeg.service';

@Component({
  selector: 'app-ffmpeg-process',
  templateUrl: './ffmpeg-process.component.html',
  styleUrls: ['./ffmpeg-process.component.scss']
})
export class FFmpegProcessComponent {
  ready = true;
  progress = 0;
  log = "";

  @ViewChild('logger') logger?: ElementRef;

  constructor(
    private ffmpegService: FFmpegService,
  ) {}

  ngOnInit(): void {
    this.ffmpegService.progress()
      .subscribe(x => this.progress = x);
    this.ffmpegService.logs()
      .subscribe(log => {
        this.log += log.message + '\n'

        if (!this.logger) return;
        const logger = this.logger.nativeElement;
        logger.scrollTo(0, logger.scrollHeight)
      });

    if (!this.ffmpegService.ready) {
      this.ready = false;
      return;
    }

    this.ffmpegService.run();
  }
}
