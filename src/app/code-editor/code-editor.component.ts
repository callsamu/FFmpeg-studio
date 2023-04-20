import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { oneDark } from './code-editor.theme';
import { EditorView, minimalSetup } from 'codemirror';
import { autocompletion } from '@codemirror/autocomplete';
import { lineNumbers } from '@codemirror/view';
import { ffmpeg } from 'src/language-ffmpeg/language';
import { Observable } from 'rxjs';
import { Change } from '../editor-change';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements AfterViewInit {
  @ViewChild('editor') element?: ElementRef;

  @Input() changes?: Observable<Change>;
  editor?: EditorView;

  ngOnInit(): void {
    if (!this.changes) return;
    this.changes.subscribe(change => this.handleExternalChange(change));
  }

  ngAfterViewInit(): void {
    this.initEditor();
  }

  initEditor(): void {
    if (!this.element) return;

    this.editor = new EditorView({
      parent: this.element.nativeElement,
      extensions: [
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

  handleExternalChange(change: Change): void {
    if (!this.editor) return;

    const selections = this.editor.state.selection;
    const [range] = selections.asSingle().ranges;

    this.editor.dispatch({
      changes: { from: range.from, insert: change.value }
    });
  }
}
