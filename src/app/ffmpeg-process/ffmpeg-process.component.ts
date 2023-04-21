import { ChangeDetectorRef, Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FFmpegService } from '../ffmpeg.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ffmpeg-process',
  templateUrl: './ffmpeg-process.component.html',
  styleUrls: ['./ffmpeg-process.component.scss']
})
export class FFmpegProcessComponent implements OnInit {
  ready = true;
  output?: string;
  progress = 0;
  log = "";

  @ViewChild('logger') logger?: ElementRef;

  constructor(
    public ffmpegService: FFmpegService,
    private changeDetector: ChangeDetectorRef,
    private location: Location,
  ) {}

  goBack(): void {
    this.location.back();
  }

  cancel(): void {
    this.ffmpegService.cancel();
  }

  ngOnInit(): void {
    this.log = "";

    this.ffmpegService.progress()
      .subscribe(x => this.progress = x);
    this.ffmpegService.whenItLogs()
      .subscribe(() => {
        if (!this.logger?.nativeElement) return;

        this.changeDetector.detectChanges();

        const logger = this.logger.nativeElement;
        logger.scrollTop = logger.scrollHeight;
      });

    try {
      this.ffmpegService.run().then(() => {
        const output = this.ffmpegService.output();
        console.log(output);
        if (output) this.output = output;
      }).catch(() => {
        console.log("Exiting ffmpeg...")
      });
    } catch(err) {
      console.log(err);
    }
  }
}
