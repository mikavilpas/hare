import * as p from "parjs";
import {
  between,
  later,
  many,
  map,
  mapConst,
  not,
  or,
  qthen,
  recover,
  stringify,
  then,
} from "parjs/combinators";
import { called, joinSuccessiveStringTokens } from "../parseUtils";
import { literalQuote } from "./formatting";
import { linebreak, tokenFactory } from "./tokens";

export function tokenize(text) {
  const tokens = definition.parse(text);
  return tokens;
}

const fullWidthNumber = () => {
  const num0 = p.string("０").pipe(mapConst("0"));
  const num1 = p.string("１").pipe(mapConst("1"));
  const num2 = p.string("２").pipe(mapConst("2"));
  const num3 = p.string("３").pipe(mapConst("3"));
  const num4 = p.string("４").pipe(mapConst("4"));
  const num5 = p.string("５").pipe(mapConst("5"));
  const num6 = p.string("６").pipe(mapConst("6"));
  const num7 = p.string("７").pipe(mapConst("7"));
  const num8 = p.string("８").pipe(mapConst("8"));
  const num9 = p.string("９").pipe(mapConst("9"));

  return num0.pipe(
    or(num1, num2, num3, num4, num5, num6, num7, num8, num9),
    many(),
    stringify(),
    map(parseInt),
    called("fullWidthNumber")
  );
};

const katakanaToken = p
  .anyCharOf(
    "アイウエオカガキギクグケゲコゴサザシジスズセゼソゾ" +
      "タダチヂツヅテデトドナニヌネノハバパヒビピフブプ" +
      "ヘベペホボポマミムメモヤユヨラリルレロワヰヱヲンヴヷヸヹヺ"
  )
  .pipe(called("katakanaToken"));

export const kanjiNumber = p
  .anyCharOf("一二三四五六七八九十")
  .pipe(called("kanjiNumber"));

const level1Heading = kanjiNumber.pipe(
  between(p.anyCharOf("■□")),
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
