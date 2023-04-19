import { OnChanges, AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild, SimpleChanges } from '@angular/core';
import hljs from 'highlight.js';
import { CodeJar, Position } from 'codejar';
import { FFmpegSyntax } from '../syntax';

type UpdateEvent = {
  code: string;
  cursor: Position;
}

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements OnChanges, AfterViewInit {
  @ViewChild('editor') element?: ElementRef;
  editor?: CodeJar;

  @Input() code = "";
  @Output() codeChange = new EventEmitter<UpdateEvent>;

  ngAfterViewInit(): void {
    if (!this.element) return;

    hljs.registerLanguage('ffmpeg', FFmpegSyntax);

    const highlight = (e: HTMLElement) => {
      const code = e.textContent ?? "";
      const highlight = hljs.highlight(code, { language: 'ffmpeg' });
      e.innerHTML = highlight.value;
    }

    this.editor = CodeJar(
      this.element.nativeElement,
      highlight,
    );

    this.editor.onUpdate(code => {
      if (!this.editor) return;
      this.codeChange.emit({
        code: code,
        cursor: this.editor.save()
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.editor) return;

    const newCode = changes["code"].currentValue as string;
    const charDifference = newCode.length - this.editor.toString().length;

    const pos = this.editor.save();
    this.editor.updateCode(newCode);

    pos.start += charDifference;
    pos.end += charDifference;

    this.editor.restore(pos);
  }
}
