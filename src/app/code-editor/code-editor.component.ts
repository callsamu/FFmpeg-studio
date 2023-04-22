import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { oneDark } from './code-editor.theme';
import { EditorView, minimalSetup } from 'codemirror';
import { undo } from '@codemirror/commands';
import { autocompletion } from '@codemirror/autocomplete';
import { lineNumbers } from '@codemirror/view';
import { lintGutter } from '@codemirror/lint';
import { ffmpeg } from 'src/language-ffmpeg/language';
import { Observable } from 'rxjs';
import { EditorEvent, EditorEventType } from '../editor-event';
import { ArgsService } from '../args.service';
import { newLinter } from 'src/language-ffmpeg/linter';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements AfterViewInit {
  @ViewChild('editor') element?: ElementRef;

  @Input() events?: Observable<EditorEvent>;
  editor?: EditorView;

  @Output() code = new EventEmitter<string>;

  constructor(
    private argsService: ArgsService,
  ) {}

  ngOnInit(): void {
    if (!this.events) return;
    this.events.subscribe(change => this.handleEvent(change));
  }

  ngAfterViewInit(): void {
    this.initEditor();
  }

  initEditor(): void {
    if (!this.element) return;

    const files = this.argsService.files;
    const linter = newLinter(file => files.has(file));

    this.editor = new EditorView({
      parent: this.element.nativeElement,
      extensions: [
        lintGutter(),
        linter,
        lineNumbers(),
        minimalSetup,
        autocompletion(),
        oneDark,
        ffmpeg(),
      ],
    });

    this.editor.dispatch({
      changes: {from: 0, insert: "ffmpeg"}
    })

  }

  handleEvent(event: EditorEvent): void {
    if (!this.editor) return;

    switch (event.type) {
      case EditorEventType.insertion:
        const selections = this.editor.state.selection;
        const [range] = selections.asSingle().ranges;

        this.editor.dispatch({
          changes: { from: range.from, insert: event.value ?? "" }
        });
        break;
      case EditorEventType.retrieval:
        this.code.emit(this.editor.state.doc.toString());
        break;
      case EditorEventType.undo:
        undo(this.editor)
        break;
    }
  }
}
