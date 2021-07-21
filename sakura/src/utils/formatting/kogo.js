import * as p from "parjs";
import { many, map, not, or, qthen, then } from "parjs/combinators";
import { called, joinSuccessiveStringTokens } from "../parseUtils";
import { attempt, quoteToken } from "./formatting";
import {
  blackCircledNumber,
  chineseCircledNumber,
  linebreak,
  tokenFactory,
} from "./tokens";

// 古語
export function tokenize(text) {
  const tokens = definition.parse(text);
  return tokens;
}

const level1Heading = linebreak.pipe(
  qthen(chineseCircledNumber),
  called("level1Heading")
);

const level2Heading = linebreak.pipe(
  qthen(blackCircledNumber),
  called("level2Heading")
);

const definitionChar = level1Heading.pipe(
  attempt(),
  or(level2Heading.pipe(attempt())),
  not(),
  qthen(linebreak.pipe(or(quoteToken, p.anyChar()))),
  called("definitionChar")
);

const level2 = level2Heading.pipe(
  then(
    definitionChar.pipe(
      many(),
      map(joinSuccessiveStringTokens),
      called("level2 content")
    )
  ),
  map((tokens) => {
    const [heading, content] = tokens;
    return tokenFactory.secondLevelDefinition(0, content, heading);
  }),
  called("level2")
);

const level1 = level1Heading.pipe(
  then(
    level2.pipe(
      attempt(),
      or(definitionChar),
      many(),
      map(joinSuccessiveStringTokens),
      called("level1 content")
    )
  ),
  map((tokens) => {
    const [heading, content] = tokens;
    return tokenFactory.firstLevelDefinition(content, heading);
  }),
  called("level1")
);

const definition = level1.pipe(
  attempt(),
  or(level2.pipe(attempt()), definitionChar, p.anyChar()),
  many(),
  map(joinSuccessiveStringTokens),
  called("definition")
);
