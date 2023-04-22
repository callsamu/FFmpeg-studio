import { Injectable } from '@angular/core';
import { EditorState } from '@codemirror/state';
import { newLinter } from 'src/language-ffmpeg/linter';
import { ArgsService } from './args.service';
import { autocompletion } from '@codemirror/autocomplete';
import { lineNumbers } from '@codemirror/view';
import { lintGutter } from '@codemirror/lint';
import { ffmpeg } from 'src/language-ffmpeg/language';
import { oneDark } from './code-editor/code-editor.theme';
import { minimalSetup } from 'codemirror';

@Injectable({
  providedIn: 'root'
})
export class EditorStatesService {
  private states = new Map<string, EditorState>();

  constructor(
    private argsService: ArgsService
  ) {}

  fetch(commandName: string): EditorState {
    const state = this.states.get(commandName)
    if (state) return state;

    const files = this.argsService.files;
    const linter = newLinter(file => files.has(file));

    return EditorState.create({
      doc: "ffmpeg",
      extensions: [
        lintGutter(),
        linter,
        lineNumbers(),
        minimalSetup,
        autocompletion(),
        oneDark,
        ffmpeg(),
      ]
    });
  }

  save(commandName: string, state: EditorState) {
    this.states.set(commandName, state);
  }

}
