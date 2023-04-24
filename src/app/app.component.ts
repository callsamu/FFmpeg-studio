import {MediaMatcher} from '@angular/cdk/layout';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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

  commands$!: Observable<string[]>;

  readonly routerMatchOptions = {
    matrixParams: 'exact' as const,
    queryParams: 'exact' as const,
    paths: 'exact' as const,
    fragment: 'exact' as const,
  };

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

    this.commands$ = this.storageService.asObservable();
  }

  cmdLink(cmd: string): string {
    return `command/${cmd}`;
  }
}
