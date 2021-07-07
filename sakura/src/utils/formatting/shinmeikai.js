import * as p from "parjs";
import {
  between,
  flatten,
  later,
  many,
  map,
  not,
  or,
  qthen,
  then,
} from "parjs/combinators";
import { called, joinSuccessiveStringTokens } from "../parseUtils";
import { attempt, literalQuote } from "./formatting";
import { kanjiNumber, linebreak, tokenFactory } from "./tokens";

export function tokenize(text) {
  const tokens = definition.parse(text);
  return tokens;
}

// can only occur at the start of a newline
const level1Heading = linebreak.pipe(
  then(kanjiNumber.pipe(between("[", "]"))),
  called("level1Heading")
);

const level2Heading = linebreak.pipe(
  then(kanjiNumber.pipe(between("(", ")"))),
  called("level2Heading")
);

export const definitionChar = level1Heading.pipe(
  attempt(),
  or(level2Heading.pipe(attempt())),
  not(),
  qthen(linebreak.pipe(or(literalQuote.pipe(attempt()), p.anyChar()))),
  called("definitionChar")
);

const level2 = later();
export const level1 = level1Heading.pipe(
  then(
    definitionChar.pipe(
      attempt(),
      or(level2.pipe(attempt())),
      many(),
      flatten(),
      map(joinSuccessiveStringTokens),
      called("level1 content")
    )
  ),
  map((tokens) => {
    const [headingObject, content] = tokens;
    const [newline, headingNumber] = headingObject;
    const heading = `[${headingNumber}]`;
    return [newline, tokenFactory.firstLevelDefinition(content, heading)];
  }),
  called("level1")
);

level2.init(
  level2Heading.pipe(
    then(
      definitionChar.pipe(
        many(),
        map(joinSuccessiveStringTokens),
        called("level2 content")
      )
    ),
    map((tokens) => {
      const [headingObject, content] = tokens;
      const [newline, headingNumber] = headingObject;
      const heading = `[${headingNumber}]`;
      const index = 0;
      return [
        newline,
        tokenFactory.secondLevelDefinition(index, content, heading),
      ];
    }),
    called("level2")
  )
);

const definition = definitionChar.pipe(
  or(
    level1.pipe(attempt(), called("top-level level1 definition")),
    level2.pipe(attempt(), called("top-level level2 definition")),
    p.anyChar().pipe(called("unknown token, always included"))
  ),
  many(),
  map(joinSuccessiveStringTokens),
  flatten(),
  called("definition")
);
