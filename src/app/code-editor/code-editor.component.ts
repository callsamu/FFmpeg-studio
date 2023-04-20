import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { javascript } from '@codemirror/lang-javascript';
import { basicSetup, EditorView } from 'codemirror';
import { oneDark } from './code-editor.theme';

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
    if (!this.element) return;

    this.editor = new EditorView({
      extensions: [basicSetup, javascript(), oneDark],
      parent: this.element.nativeElement,
    });
  }
}
