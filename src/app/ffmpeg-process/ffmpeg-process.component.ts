import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FFmpegService } from '../ffmpeg.service';

@Component({
  selector: 'app-ffmpeg-process',
  templateUrl: './ffmpeg-process.component.html',
  styleUrls: ['./ffmpeg-process.component.scss']
})
export class FFmpegProcessComponent {
  ready = true;
  output?: string;
  progress = 0;
  log = "";

  @ViewChild('logger') logger?: ElementRef;

  constructor(
    private ffmpegService: FFmpegService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.ffmpegService.progress()
      .subscribe(x => this.progress = x);
    this.ffmpegService.logs()
      .subscribe(log => {
        if (!this.logger) return;

        this.log += log.message + '\n';
        this.changeDetector.detectChanges();

        const logger = this.logger.nativeElement;
        logger.scrollTop = logger.scrollHeight;
      });

    if (!this.ffmpegService.ready) {
      this.ready = false;
      return;
    }

    this.ffmpegService.run().then(() => {
      const output = this.ffmpegService.output();
      if (output) this.output = output;
    });
  }
}
