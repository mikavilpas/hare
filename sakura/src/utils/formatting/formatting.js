import * as p from "parjs";
import { between, many, map, or, stringify } from "parjs/combinators";
import { joinSuccessiveStringTokens } from "../parseUtils";

export function tokenize(text) {
  const tokens = highlightQuotes().parse(text);
  return tokens;
}

export const qopen = "「";
export const qclose = "」";
const quoteChars = qopen + qclose;

const highlightQuotes = () => {
  const char = p.noCharOf(quoteChars);
  const quote = char.pipe(
    many(),
    stringify(),
    between(qopen, qclose),
    map((text) => ({ type: "quote", content: text }))
  );

  return char.pipe(or(quote), many(), map(joinSuccessiveStringTokens));
};
