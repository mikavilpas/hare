import * as p from "parjs";
import {
  between,
  later,
  many,
  map,
  not,
  or,
  qthen,
  then,
} from "parjs/combinators";
import { called, joinSuccessiveStringTokens } from "../parseUtils";
import { attempt, literalQuote, quoteToken } from "./formatting";
import {
  blackCircledNumber,
  fullWidthNumber,
  kanjiNumber,
  katakanaToken,
  linebreak,
  tokenFactory,
} from "./tokens";

export function tokenize(text) {
  const tokens = definition.parse(text);
  return tokens;
}

const level1Heading = kanjiNumber.pipe(between("■"), called("level1Heading"));
const level2Heading = kanjiNumber.pipe(
  between("□"),
  or(blackCircledNumber),
  called("level2Heading")
);
const level3Heading = fullWidthNumber().pipe(
  between("（", "）"),
  called("level3Heading")
);
const level4Heading = katakanaToken.pipe(
  between("（", "）"),
  called("level4Heading")
);

export const definitionChar = level1Heading.pipe(
  not(),
  then(
    level2Heading.pipe(not()),
    level3Heading.pipe(not(), attempt()),
    level4Heading.pipe(not(), attempt())
  ),
  qthen(linebreak.pipe(or(quoteToken, p.anyChar()))),
  called("definitionChar")
);

export const level1 = later();
export const level2 = later();
export const level3 = later();
export const level4 = later();

level1.init(
  level1Heading.pipe(
    then(
      level2.pipe(
        or(level3.pipe(attempt()), definitionChar),
        many(),
        map(joinSuccessiveStringTokens),
        called("level1 content")
      )
    ),
    map((tokens) => {
      const [index, content] = tokens;
      const heading = `(${index})`;
      return tokenFactory.firstLevelDefinition(content, heading);
    }),
    called("level1")
  )
);

level2.init(
  level2Heading.pipe(
    then(
      definitionChar.pipe(
        or(level3),
        many(),
        map(joinSuccessiveStringTokens),
        called("level2 content")
      )
    ),
    map((tokens) => {
      const [index, content] = tokens;
      const heading = `(${index})`;
      return tokenFactory.secondLevelDefinition(index, content, heading);
    }),
    called("level2")
  )
);

level3.init(
  level3Heading.pipe(
    then(
      definitionChar.pipe(
        or(level4.pipe(attempt())),
        many(),
        map(joinSuccessiveStringTokens),
        called("level3 content")
      )
    ),
    map((tokens) => {
      const [index, content] = tokens;
      const heading = `(${index})`;
      return tokenFactory.thirdLevelDefinition(content, heading);
    }),
    called("level3")
  )
);

level4.init(
  level4Heading.pipe(
    then(
      definitionChar.pipe(
        many(),
        map(joinSuccessiveStringTokens),
        called("level4 content")
      )
    ),
    map((tokens) => {
      const [index, content] = tokens;
      const heading = `(${index})`;
      return tokenFactory.fourthLevelDefinition(content, heading);
    }),
    called("level4")
  )
);

const definition = definitionChar.pipe(
  or(level1, level2, level3.pipe(attempt()), p.anyChar()),
  many(),
  map(joinSuccessiveStringTokens),
  called("definition")
);
