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
import { StorageService } from 'src/storage.service';

@Injectable({
  providedIn: 'root'
})
export class EditorStatesService {
  private states = new Map<string | null, EditorState>();

  constructor(
    private argsService: ArgsService,
    private storageService: StorageService,
  ) {}

  fetch(commandName: string | null): EditorState {
    const state = this.states.get(commandName)
    if (state) return state;

    const files = this.argsService.getFiles();
    const linter = newLinter(file => files.has(file));

    const doc = commandName ?
      this.storageService.fetch(commandName ?? "") :
      null;

    return EditorState.create({
      doc: doc ?? "ffmpeg",
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

  save(commandName: string | null, state: EditorState) {
    this.states.set(commandName, state);
  }

  delete(commandName: string | null) {
    this.states.delete(commandName);
  }

  openBuffers(): (string | null)[] {
    const keys: (string | null)[] = [];
    for (const key of this.states.keys()) {
      keys.push(key);
    }
    return keys;
  }
}
