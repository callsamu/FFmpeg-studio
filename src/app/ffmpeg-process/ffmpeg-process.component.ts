import { Component } from '@angular/core';
import { ArgsService } from '../args.service';
import { FFmpegService } from '../ffmpeg.service';

@Component({
  selector: 'app-ffmpeg-process',
  templateUrl: './ffmpeg-process.component.html',
  styleUrls: ['./ffmpeg-process.component.scss']
})
export class FFmpegProcessComponent {
  constructor(
    private argsService: ArgsService,
    private ffmpegService: FFmpegService,
  ) {}

  ngOnInit(): void {


  }
}
