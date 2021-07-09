import * as p from "parjs";
import { between, many, map, not, or, qthen, then } from "parjs/combinators";
import { called, joinSuccessiveStringTokens } from "../parseUtils";
import { literalQuote } from "./formatting";
import {
  blackCircledNumberSansSerif,
  circledKatakanaToken,
  kanjiNumber,
  linebreak,
  tokenFactory,
  whiteCircledNumber,
} from "./tokens";

// 広辞苑
export function tokenize(text) {
  const tokens = definition.parse(text);
  return tokens;
}

const level1Heading = kanjiNumber.pipe(
  between("[", "]"),
  or(blackCircledNumberSansSerif),
  called("level1Heading")
);
const level2Heading = whiteCircledNumber().pipe(called("level2Heading"));
const level3Heading = circledKatakanaToken.pipe(called("level3Heading"));

const definitionChar = level1Heading.pipe(
  or(level2Heading, level3Heading),
  not(),
  qthen(linebreak.pipe(or(literalQuote, p.anyChar()))),
  called("definitionChar")
);

const level3 = level3Heading.pipe(
  then(
    definitionChar.pipe(
      many(),
      map(joinSuccessiveStringTokens),
      called("level3 content")
    )
  ),
  map((tokens) => {
    const [katakana, content] = tokens;
    const heading = katakana;
    return tokenFactory.thirdLevelDefinition(content, heading);
  }),
  called("level3")
);

const level2 = level2Heading.pipe(
  then(
    definitionChar.pipe(
      or(level3),
      many(),
      map(joinSuccessiveStringTokens),
      called("level2 content")
    )
  ),
  map((tokens) => {
    const [headingInfo, content] = tokens;
    const { char, number } = headingInfo;
    const heading = `(${number})`;
    return tokenFactory.secondLevelDefinition(number, content, heading);
  }),
  called("level2")
);

const level1 = level1Heading.pipe(
  then(
    definitionChar.pipe(
      or(level2, level3),
      many(),
      map(joinSuccessiveStringTokens),
      called("level1 content")
    )
  ),
  map((tokens) => {
    const [headingKanjiNumber, content] = tokens;
    const heading = `(${headingKanjiNumber})`;
    return tokenFactory.firstLevelDefinition(content, heading);
  }),
  called("level1")
);

const definition = definitionChar.pipe(
  or(level1, level2, level3, p.anyChar()),
  many(),
  map(joinSuccessiveStringTokens),
  called("definition")
);
