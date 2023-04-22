import { Component } from '@angular/core';
import { FFmpegService } from './ffmpeg.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ffmpeg-studio';

  constructor(
    public ffmpegService: FFmpegService,
  ) {}
}
