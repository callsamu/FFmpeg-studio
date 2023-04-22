import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { EditorView, } from 'codemirror';
import { undo } from '@codemirror/commands';
import { EditorEvent, EditorEventType } from '../editor-event';
import { Observable } from 'rxjs';
import { EditorStatesService } from '../editor-states.service';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editor') element?: ElementRef;

  @Input() events?: Observable<EditorEvent>;
  @Input() commandName = "";

  @Output() code = new EventEmitter<string>;

  editor?: EditorView;

  constructor(
    private stateService: EditorStatesService,
  ) {}

  ngOnInit(): void {
    if (!this.events) return;
    this.events.subscribe(change => this.handleEvent(change));
  }

  ngOnDestroy(): void {
    if (!this.editor) return;
    this.stateService.save(this.commandName, this.editor.state)
  }

  ngAfterViewInit(): void {
    this.initEditor();
  }

  initEditor(): void {
    if (!this.element) return;

    this.editor = new EditorView({
      parent: this.element.nativeElement,
      state: this.stateService.fetch(this.commandName),
    });
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
