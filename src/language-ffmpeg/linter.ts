import { syntaxTree } from '@codemirror/language';
import { linter, Diagnostic } from '@codemirror/lint';
import { EditorView } from 'codemirror';
import { SyntaxNodeRef } from '@lezer/common';

type FileIsUploadedFn = (filename: string) => boolean;

const fileRX = /^[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9]+)$/;

function isFilename(text: string): boolean {
  return fileRX.test(text);
}

function toText(node: SyntaxNodeRef, view: EditorView): string {
  return view.state.sliceDoc(node.from, node.to).trim();
}

function isSame(n1: SyntaxNodeRef | null, n2: SyntaxNodeRef | null): boolean {
  if (!n1  || !n2) return false;

  return n1.type.id === n2.type.id &&
         n1.from === n2.from &&
         n1.to === n1.to;
}

function argumentFlag(node: SyntaxNodeRef): SyntaxNodeRef | null {
  let curr = node;

  while (curr.name !== "FlagPlusParameters") {
    if (!curr.node.parent) return null;
    curr = curr.node.parent;
  }

  return curr.node.firstChild;
}

function warning(node: SyntaxNodeRef, message: string): Diagnostic {
  return {
    from: node.from,
    to: node.to,
    severity: "warning",
    message: message
  };
}

function error(node: SyntaxNodeRef, message: string): Diagnostic {
  return {
    from: node.from,
    to: node.to,
    severity: "error",
    message: message
  };
}

export function newLinter(isUploaded: FileIsUploadedFn) {
  return linter(view => {
    const diagnostics: Diagnostic[] = [];

    const tree = syntaxTree(view.state);

    tree.cursor().iterate(node => {
      console.log(node.type.id);
      if (node.name === "Argument") {
        const flag = argumentFlag(node);
        if (!flag) return;

        const text = toText(node, view);
        const flagName = toText(flag, view);

        if (flagName === "-i" &&
            isSame(flag.node.nextSibling, node) &&
            !isUploaded(text)) {
          const message = `File ${text} was not uploaded`;
          diagnostics.push(error(node, message));
        }
      }
    })

    return diagnostics;
  })
}
