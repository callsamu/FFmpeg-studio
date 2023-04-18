import { Component } from '@angular/core';
import { ArgsService } from '../args.service';
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


  constructor(
    private argsService: ArgsService,
    private ffmpegService: FFmpegService,
  ) {}

  ngOnInit(): void {
    this.ffmpegService.progress()
      .subscribe(x => this.progress = x);
    this.ffmpegService.logs()
      .subscribe(log => this.log += log.message + '\n');

    if (!this.ffmpegService.ready) {
      this.ready = false;
      return;
    }

    this.ffmpegService.run(this.argsService.getArgs());
  }
}
