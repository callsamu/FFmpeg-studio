import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { FFmpegProcessComponent } from './ffmpeg-process/ffmpeg-process.component';

const routes: Routes = [
  { path: '', redirectTo: 'new', pathMatch: 'full'},
  { path: 'new', component: EditorComponent },
  { path: 'command/:name', component: EditorComponent },
  { path: 'run', component: FFmpegProcessComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
