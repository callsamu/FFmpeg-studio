import {MediaMatcher} from '@angular/cdk/layout';
import { ChangeDetectorRef, Component } from '@angular/core';
import { StorageService } from 'src/storage.service';
import { FFmpegService } from './ffmpeg.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  mobileQuery?: MediaQueryList;
  scriptListing?: string[];

  title = 'ffmpeg-studio';

  private _mobileQueryListener?: () => void;

  constructor(
    private media: MediaMatcher,
    private storageService: StorageService,
    private changeDetectorRef: ChangeDetectorRef,
    public ffmpegService: FFmpegService,
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener("change", this._mobileQueryListener);

    this.storageService.asObservable().subscribe(list => {
      this.scriptListing = list;
    })
  }
}
