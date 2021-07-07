import * as p from "parjs";
import {
  between,
  later,
  many,
  map,
  not,
  or,
  qthen,
  recover,
  then,
} from "parjs/combinators";
import { called, joinSuccessiveStringTokens } from "../parseUtils";
import { literalQuote } from "./formatting";
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

const level1Heading = kanjiNumber.pipe(
  between(p.anyCharOf("■□")),
  or(blackCircledNumber),
  called("level1Heading")
);
const level2Heading = fullWidthNumber().pipe(
  between("（", "）"),
  called("level2Heading")
);
const level3Heading = katakanaToken.pipe(
  between("（", "）"),
  called("level3Heading")
);

export const definitionChar = level1Heading.pipe(
  not(),
  then(level2Heading.pipe(not()), level3Heading.pipe(not())),
  qthen(linebreak.pipe(or(literalQuote, p.anyChar()))),
  called("definitionChar")
);

export const level2 = later();
export const level3 = later();
export const level1 = level1Heading.pipe(
  then(
    definitionChar.pipe(
      or(level2),
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
);

level2.init(
  level2Heading.pipe(
    then(
      definitionChar.pipe(
        or(level3.pipe(recover(() => ({ kind: "Soft" })))),
        many(),
        map(joinSuccessiveStringTokens),
        called("level2 content")
      )
    ),
    map((tokens) => {
      const [index, content] = tokens;
      const heading = `（${index}）`;
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
    map((tokens) => {
      const [index, content] = tokens;
      const heading = `（${index}）`;
      return tokenFactory.thirdLevelDefinition(content, heading);
    }),
    called("level3")
  )
);

const definition = definitionChar.pipe(
  or(level1, level2, p.anyChar()),
  many(),
  map(joinSuccessiveStringTokens),
  called("definition")
);
