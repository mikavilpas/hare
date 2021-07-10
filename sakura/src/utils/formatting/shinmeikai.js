import * as p from "parjs";
import {
  between,
  flatten,
  later,
  many,
  manySepBy,
  map,
  must,
  not,
  or,
  qthen,
  stringify,
  then,
} from "parjs/combinators";
import { called, joinSuccessiveStringTokens } from "../parseUtils";
import { attempt, literalQuote } from "./formatting";
import {
  fullWidthCapitalLetter,
  kanjiNumber,
  linebreak,
  tokenFactory,
} from "./tokens";

export function tokenize(text) {
  const tokens = definition.parse(text);
  return tokens;
}

// can only occur at the start of a newline
const level1Heading = linebreak.pipe(
  then(kanjiNumber.pipe(between("[", "]"))),
  called("level1Heading")
);

const level2Heading = kanjiNumber
  .pipe(between("(", ")"))
  .pipe(called("level2Heading"));

const level3Heading = fullWidthCapitalLetter.pipe(
  between("(", ")"),
  called("level3Heading")
);

export const definitionChar = later();

export const exampleSentenceBlock = p.noCharOf("／」").pipe(
  many(),
  stringify(),
  manySepBy("／"),
  must((tokens) => {
    return Array.isArray(tokens) && tokens.length > 1;
  }),
  between("「", "」"),
  map((tokens) => {
    // "split" into many quotes instead of one huge example sentence block
    const sentences = tokens.map((t) => `「${t} 」`);
    return tokenFactory.exampleSentenceGroup(sentences);
  }),
  called("exampleSentenceBlock")
);

definitionChar.init(
  level1Heading.pipe(
    attempt(),
    or(
      level2Heading.pipe(attempt()),
      level3Heading.pipe(attempt()),
      exampleSentenceBlock.pipe(attempt())
    ),
    not(),
    qthen(linebreak.pipe(or(literalQuote.pipe(attempt()), p.anyChar()))),
    called("definitionChar")
  )
);

const level2 = later();
const level3 = later();
export const level1 = level1Heading.pipe(
  then(
    definitionChar.pipe(
      attempt(),
      or(exampleSentenceBlock, level2.pipe(attempt())),
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
        or(exampleSentenceBlock, level3.pipe(attempt())),
        many(),
        map(joinSuccessiveStringTokens),
        called("level2 content")
      )
    ),
    map((tokens) => {
      const [headingNumber, content] = tokens;
      const heading = `[${headingNumber}]`;
      const index = 0;
      return tokenFactory.secondLevelDefinition(index, content, heading);
    }),
    called("level2")
  )
);

level3.init(
  level3Heading.pipe(
    then(
      definitionChar.pipe(
        or(exampleSentenceBlock),
        many(),
        map(joinSuccessiveStringTokens),
        called("level3 content")
      )
    ),
    map((tokens) => {
      const [headingSymbol, content] = tokens;
      const heading = `(${headingSymbol})`;
      return tokenFactory.thirdLevelDefinition(content, heading);
    }),
    called("level3")
  )
);

const definition = definitionChar.pipe(
  or(
    level1.pipe(attempt(), called("top-level level1 definition")),
    level2.pipe(attempt(), called("top-level level2 definition")),
    level3.pipe(attempt(), called("top-level level3 definition")),
    exampleSentenceBlock.pipe(called("top-level example sentence block")),
    p.anyChar().pipe(called("unknown token, always included"))
  ),
  many(),
  map(joinSuccessiveStringTokens),
  flatten(),
  called("definition")
);
