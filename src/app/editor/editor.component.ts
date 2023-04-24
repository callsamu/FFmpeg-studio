import { Component, OnInit } from '@angular/core';
import { ArgsService } from '../args.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { EditorEvent, EditorEventType } from '../editor-event';
import { FFmpegService } from '../ffmpeg.service';
import { MatDialog } from '@angular/material/dialog';
import { FileDialogComponent } from '../file-dialog/file-dialog.component';
import { SaveDialogComponent } from '../save-dialog/save-dialog.component';
import { StorageService } from 'src/storage.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  command = "ffmpeg";
  commandName = "";

  eventsToEditor = new Subject<EditorEvent>();

  constructor(
    private storageService: StorageService,
    private dialogService: MatDialog,
    private ffmpegService: FFmpegService,
    private argsService: ArgsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    if (!this.ffmpegService.ready) {
      this.ffmpegService.load();
    }

    if (this.router.url.startsWith('/command')) {
      const name = this.route.snapshot.paramMap.get('name');
      if (!name) return;

      const command = this.storageService.fetch(name);
      if (!command) return;

      this.commandName = name;

      console.log(command);
    }
  }

  run(): void {
    this.eventsToEditor.next({
      type: EditorEventType.retrieval
    });

    this.argsService.setArgs(this.command);
    this.router.navigateByUrl("run");
  }

  save(): void {
    this.eventsToEditor.next({
      type: EditorEventType.retrieval
    });

    if (this.commandName !== "") {
      this.storageService.save(this.commandName, this.command);
    } else {
      this.dialogService.open(SaveDialogComponent, {
        width: "300px",
        height: "300x",
      }).afterClosed().subscribe(value => {
        if (!value) return;
        this.storageService.save(value as string, this.command);
      });
    }
  }

  undo(): void {
    this.eventsToEditor.next({
      type: EditorEventType.undo
    })
  }

  openFileDialog(): void {
    const filenames = this.argsService.filenames();

    this.dialogService.open(FileDialogComponent, {
      height: !filenames ? '250px' : '200px',
      width: '250px',
      data: {files: filenames}
    }).afterClosed().subscribe(filename => {
      this.eventsToEditor.next({
        type: EditorEventType.insertion,
        value: filename as string,
      });
    });
  }

  onFileSelected(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    let fileList = input.files;

    if (!fileList) return;

    for (let i = 0; i < fileList.length; i ++) {
      const file = fileList[i];

      const filename = file.name.search(/\s+/) > 0 ?
        `"${file.name}"` :
        file.name;

      this.eventsToEditor.next({
        value: filename,
        type: EditorEventType.insertion,
      });

      this.argsService.addFile(new File([file], filename));
    }
  }
}
