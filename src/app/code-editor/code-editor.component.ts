import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { oneDark } from './code-editor.theme';
import { basicSetup, EditorView } from 'codemirror';
import { ffmpeg } from 'src/language-ffmpeg/language';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements AfterViewInit {
  @ViewChild('editor') element?: ElementRef;

  @Input() code = "";

  editor?: EditorView;

  ngAfterViewInit(): void {
    this.initEditor();
  }

  initEditor(): void {
    if (!this.element) return;


    this.editor = new EditorView({
      extensions: [basicSetup, oneDark, ffmpeg()],
      parent: this.element.nativeElement,
    });
  }
}
