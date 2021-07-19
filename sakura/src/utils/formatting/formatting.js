import * as p from "parjs";
import {
  between,
  later,
  many,
  map,
  or,
  recover,
  stringify,
} from "parjs/combinators";
import { linebreak, tokenFactory } from "./tokens";
import { called, joinSuccessiveStringTokens } from "../parseUtils";

export function tokenize(text) {
  const tokens = highlightQuotes().parse(text);
  return tokens;
}

export const quoted = (start, end) => {
  const plainText = p
    .noCharOf(end)
    .pipe(
      many(),
      stringify(),
      called(`any plain text except the quote chars ${start} ${end}`)
    );

  // a quote is defined as (text) or (another quote)
  const quote = later();
  quote.init(
    quote.pipe(called("inner quote")).pipe(
      map((q) => {
        // flatten nested quotes (no need to preserve them)
        return q.content.join("");
      }),
      //
      or(plainText),
      between(start, end),

      called(`quote ${start} ${end}`),
      map((text) => {
        // put the quotes back in so the formatting is preserved
        const content = [start + text + end];
        const innerQuote = text;
        return tokenFactory.literalQuote(content, innerQuote);
      })
    )
  );

  return quote;
};

// Parses some kind of meta information token about the definition word, such as
// "（「洞」 とも書く）". Can be ignored so that no other quote formatting is
// applied in these tokens.
export const literalQuote = quoted("（", "）").pipe(
  or(
    //
    quoted("[", "]"),
    quoted("〔", "〕"),
    quoted("(", ")"),
    quoted("《", "》"),
    quoted("{", "}")
  ),
  map((tokens) => {
    // a literal quote is to be ignored, so we return it as plain text
    return tokens.content.join("");
  }),
  called("literalQuote")
);

export const exampleSentence = quoted("「", "」").pipe(
  map((quoteToken) => {
    return tokenFactory.exampleSentence(
      quoteToken.content,
      quoteToken.innerQuote
    );
  }),
  called("exampleSentence")
);

export const quoteToken = literalQuote.pipe(
  or(exampleSentence),
  called("quoteToken")
);

export const highlightQuotes = () => {
  return quoteToken.pipe(
    or(linebreak, p.anyChar()),
    many(),
    map(joinSuccessiveStringTokens)
  );
};

export const attempt = () => recover(() => ({ kind: "Soft" }));
