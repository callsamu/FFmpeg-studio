import { syntaxTree } from '@codemirror/language';
import { linter, Diagnostic } from '@codemirror/lint';

type FileIsUploadedFn = (filename: string) => boolean;

export function newLinter(isUploaded: FileIsUploadedFn) {
  return linter(view => {
    const diagnostics: Diagnostic[] = [];
    syntaxTree(view.state).cursor().iterate(node => {
      if (node.name === "Argument") {
        const token = view.state.sliceDoc(node.from, node.to).trim();
        const fileRX = /^[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9]+)$/;

        if (isUploaded(token) && fileRX.test(token)) {
          diagnostics.push({
            from: node.from,
            to: node.to,
            severity: "error",
            message: `File "${token}" was not uploaded.`
          });
        }
      }
    })
    return diagnostics;
  })
}
