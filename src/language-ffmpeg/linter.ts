import { syntaxTree } from '@codemirror/language';
import { linter, Diagnostic } from '@codemirror/lint';
import { EditorView } from 'codemirror';
import { SyntaxNodeRef } from '@lezer/common';

type FileIsUploadedFn = (filename: string) => boolean;
type IterateFn = (node: SyntaxNodeRef) => void;

const fileRX = /^[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9]+)$/;

function isFilename(text: string): boolean {
  return fileRX.test(text);
}

function toText(node: SyntaxNodeRef, view: EditorView): string {
  return view.state.sliceDoc(node.from, node.to).trim();
}

function error(node: SyntaxNodeRef, message: string): Diagnostic {
  return {
    from: node.from,
    to: node.to,
    severity: "error",
    message: message
  };
}

function iterateOnTree(view: EditorView, iterator: IterateFn) {
  syntaxTree(view.state).cursor().iterate(iterator);
}

export function newLinter(isUploaded: FileIsUploadedFn) {
  return linter(view => {
    const diagnostics: Diagnostic[] = [];

    iterateOnTree(view, node => {
      if (node.name === "Argument") {
        const text = toText(node, view)

        if (isFilename(text) && !isUploaded(text)) {
          const message = `File "${text}" was not uploaded.`;
          diagnostics.push(error(node, message));
        }
      }
    })

    return diagnostics;
  })
}
