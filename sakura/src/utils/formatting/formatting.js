import * as p from "parjs";
import { between, many, map, or, stringify } from "parjs/combinators";
import { joinSuccessiveStringTokens } from "../parseUtils";

export function tokenize(text) {
  const tokens = highlightQuotes().parse(text);
  return tokens;
}

const quoted = (start, end) => {
  return p.noCharOf(start + end).pipe(
    many(),
    stringify(),
    between(start, end),
    map((text) => {
      // put the quotes back in so the formatting is preserved
      return start + text + end;
    })
  );
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
  )
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
