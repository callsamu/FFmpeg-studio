import { OnChanges, AfterViewInit, Component, ElementRef, Input, ViewChild, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements OnChanges, AfterViewInit {
  @ViewChild('editor') element?: ElementRef;

  @Input() code = "";

  ngAfterViewInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {}
}
