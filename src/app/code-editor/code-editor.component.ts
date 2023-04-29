import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
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
export class CodeEditorComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('editor') element?: ElementRef;

  @Input() events?: Observable<EditorEvent>;
  @Input() commandName: string | null = null;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['commandName'] || !this.editor) return

    const { currentValue, previousValue } = changes['commandName'];

    if (currentValue !== previousValue) {
      this.stateService.save(previousValue, this.editor.state);
      this.editor.setState(this.stateService.fetch(currentValue));
    }
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
