import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import hljs from 'highlight.js';
import { CodeJar } from 'codejar';
import { FFmpegSyntax } from '../syntax';


@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements AfterViewInit {
  @ViewChild('editor') element?: ElementRef;
  editor?: CodeJar;

  ngAfterViewInit(): void {
    if (!this.element) return;

    hljs.registerLanguage('ffmpeg', FFmpegSyntax);

    const highlight = (e: HTMLElement) => {
      let code = e.textContent ?? "";
      let highlight = hljs.highlight(code, { language: 'ffmpeg' });
      e.innerHTML = highlight.value;
    }

    this.editor = CodeJar(
      this.element.nativeElement,
      highlight,
    );
    console.log(this.editor);
  }
}
