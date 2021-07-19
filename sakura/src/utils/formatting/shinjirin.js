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
import { attempt, quoteToken } from "./formatting";
import {
  fullWidthNumber,
  ideographicSpace,
  katakanaToken,
  linebreak,
  tokenFactory,
} from "./tokens";

export function tokenize(text) {
  const tokens = definition.parse(text);
  return tokens;
}

const level1Heading = linebreak.pipe(
  // the "between" part is kinda lazy since it makes it possible to read a
  // number between different quote characters, but that is unlikely to happen
  // anyway
  then(fullWidthNumber().pipe(between(p.anyCharOf("(["), p.anyCharOf(")]")))),
  called("level1Heading")
);

const level2Heading = ideographicSpace
  .pipe(many(), qthen(fullWidthNumber().pipe(between("(", ")"))))
  .pipe(called("level2Heading"));
const level3Heading = katakanaToken.pipe(between("(", ")"));

export const definitionChar = level1Heading.pipe(
  or(level2Heading.pipe(attempt()), level3Heading),
  not(),
  qthen(linebreak.pipe(or(quoteToken, p.anyChar()))),
  called("definitionChar")
);

const level2 = later();
const level3 = later();
export const level1 = level1Heading.pipe(
  then(
    level2.pipe(
      attempt(),
      or(level3, definitionChar),
      many(),
      map(joinSuccessiveStringTokens),
      called("level1 content")
    )
  ),
  map((tokens) => {
    const [headingObject, content] = tokens;
    const [newline, index] = headingObject;
    const heading = `(${index})`;
    return [newline, tokenFactory.firstLevelDefinition(content, heading)];
  }),
  called("level1")
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
    map(joinSuccessiveStringTokens),
    map((tokens) => {
      const [headingKatakana, content] = tokens;
      const heading = `(${headingKatakana})`;
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
        many(),
        map(joinSuccessiveStringTokens),
        called("level3 content")
      )
    ),
    map(joinSuccessiveStringTokens),
    map((tokens) => {
      const [katakana, content] = tokens;
      const heading = `(${katakana})`;
      return tokenFactory.thirdLevelDefinition(content, heading);
    }),
    called("level3")
  )
);

const definition = level1.pipe(
  attempt(),
  or(level2.pipe(attempt()), level3, p.anyChar()),
  many(),
  map(joinSuccessiveStringTokens),
  flatten(),
  called("definition")
);
