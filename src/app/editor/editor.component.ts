import { Component, OnInit } from '@angular/core';
import { ArgsService } from '../args.service';
import { Router, ActivatedRoute, ActivationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { EditorEvent, EditorEventType } from '../editor-event';
import { FFmpegService } from '../ffmpeg.service';
import { MatDialog } from '@angular/material/dialog';
import { FileDialogComponent } from '../file-dialog/file-dialog.component';
import { SaveDialogComponent } from '../save-dialog/save-dialog.component';
import { StorageService } from 'src/storage.service';
import { Subject } from 'rxjs';
import { EditorStatesService } from '../editor-states.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  readonly namelessCommand = "New Command";
  command = "ffmpeg";
  tabs = new Set<string | null>();
  commandName: string | null = null;

  eventsToEditor = new Subject<EditorEvent>();

  constructor(
    private editorService: EditorStatesService,
    private storageService: StorageService,
    private dialogService: MatDialog,
    private ffmpegService: FFmpegService,
    private argsService: ArgsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.ffmpegService.ready) {
      this.ffmpegService.load();
    }

    this.router.events.subscribe(event => {
      if (!(event instanceof ActivationEnd)) return;
      this.routerToCommand(event.snapshot);
    })

    const buffers = this.editorService.openBuffers();
    buffers.forEach(buffer => this.addTab(buffer));
    this.routerToCommand(this.route.snapshot);
  }

  private routerToCommand(snapshot: ActivatedRouteSnapshot): void {
    const name = snapshot.paramMap.get('name');

    if (name) {
      const command = this.storageService.fetch(name);
      if (!command) return;

      this.commandName = name;
      this.command = command;
    }

    this.addTab(this.commandName);
    console.log(this.tabs);
  }

  addTab(commandName: string | null): void {
    this.tabs.add(commandName);
  }

  closeTab(event: MouseEvent, commandName: string | null): void {
    event.stopPropagation();
    event.preventDefault();

    const array = Array.from(this.tabs);
    const idx = array.indexOf(commandName);
    const next = array[idx === 0 ? 1 : idx - 1];

    this.tabs.delete(commandName);
    this.editorService.delete(commandName);

    this.router.navigate(['command', {name: next}]);
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

    if (this.commandName) {
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
