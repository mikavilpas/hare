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
import { called, joinSuccessiveStringTokens } from "../parseUtils";

export function tokenize(text) {
  const tokens = highlightQuotes().parse(text);
  return tokens;
}

const quoted = (start, end) => {
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
      //
      or(plainText),
      between(start, end),

      called(`quote ${start} ${end}`),
      map((text) => {
        // put the quotes back in so the formatting is preserved
        return start + text + end;
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
  called("literalQuote")
);

const highlightQuotes = () => {
  const quote = quoted("「", "」").pipe(
    map((text) => ({ type: "quote", content: text }))
  );

  return literalQuote.pipe(
    or(quote, p.anyChar()),
    many(),
    map(joinSuccessiveStringTokens)
  );
};

export const attempt = () => recover(() => ({ kind: "Soft" }));
