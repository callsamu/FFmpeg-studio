import { indentNodeProp, LanguageSupport, LRLanguage } from '@codemirror/language';
import { styleTags, tags as t } from '@lezer/highlight';
import { COMPLETIONS } from './completion';
import { parser } from './parser';

export function ffmpeg(): LanguageSupport {
  const tags = styleTags({
    CommandName: t.keyword,
    Flag: t.operator,
    Argument: t.constant(t.name),
    String: t.string,
  });

  let parserWithMetadata = parser.configure({
    props: [tags, indentNodeProp.add({
      FlagAndParameter: context => {
        const line = context.lineAt(context.node.from);
        console.log(line);
        const ident = context.lineIndent(line.from);
        console.log(ident);
        return ident;
      }
    })]
  });

  const language = LRLanguage.define(({
    parser: parserWithMetadata,
  }));
  const completion = language.data.of({ autocomplete: COMPLETIONS });
  return new LanguageSupport(language, [completion]);
}
