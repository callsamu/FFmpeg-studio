import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { FFmpegProcessComponent } from './ffmpeg-process/ffmpeg-process.component';

const routes: Routes = [
  { path: '', redirectTo: 'command', pathMatch: 'full'},
  { path: 'command', component: EditorComponent },
  { path: 'run', component: FFmpegProcessComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
