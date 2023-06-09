import { NgModule, isDevMode } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { FFmpegProcessComponent } from './ffmpeg-process/ffmpeg-process.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { MessageComponent } from './message/message.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FileDialogComponent } from './file-dialog/file-dialog.component';
import { SaveDialogComponent } from './save-dialog/save-dialog.component';
import { ExpandOnActiveLinkDirective } from './expand-on-active-link.directive';
import { NavExpandableMenuComponent } from './nav-expandable-menu/nav-expandable-menu.component';
import { ffmpegServiceProvider } from './ffmpeg.service.provider';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    FFmpegProcessComponent,
    CodeEditorComponent,
    MessageComponent,
    FileDialogComponent,
    SaveDialogComponent,
    NavExpandableMenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatTabsModule,
    ExpandOnActiveLinkDirective,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    {provide: Storage, useValue: localStorage},
    ffmpegServiceProvider,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
