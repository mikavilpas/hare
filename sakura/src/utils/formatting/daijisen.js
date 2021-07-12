import * as p from "parjs";
import {
  between,
  flatten,
  many,
  manySepBy,
  map,
  maybe,
  not,
  or,
  qthen,
  stringify,
  then,
} from "parjs/combinators";
import { called, joinSuccessiveStringTokens } from "../parseUtils";
import { attempt, literalQuote, quoted } from "./formatting";
import {
  circledKatakanaToken,
  kanjiNumber,
  linebreak,
  tokenFactory,
} from "./tokens";

export function tokenize(text) {
  const tokens = daijisenDefinition.parse(text);
  return tokens;
}

const level1Heading = p
  .anyStringOf("[一]", "[二]")
  .pipe(called("level1Heading"));
const level2Heading = p.int().pipe(between("(", ")"), called("level2Heading"));
const level3Heading = circledKatakanaToken.pipe(called("level3Heading"));
const synonymSectionHeading = p.string("［類語］");
const cliticSectionHeading = p.string("［下接語］");

export const synonymSection = () => {
  const synonym = p
    .noCharOf("・／")
    .pipe(many(), stringify(), called("a single synonym"));

  const section = () => {
    const referenceHeading = kanjiNumber.pipe(
      between("(", ")"),
      map((n) => {
        return `(${n})`;
      }),
      called("referenceHeading")
    );

    const sectionOptionHeading = quoted("{", "}")
      .pipe(maybe(""), then(p.string("[subscript]（(")))
      .pipe(
        then(p.int(), p.string(")）[/subscript]")),
        map((tokens) => {
          const [qstart, n, qend, contents] = tokens;
          const heading = `(${n})`;
          return heading;
        }),
        called("sectionOptionHeading")
      );

    return referenceHeading.pipe(
      attempt(),
      or(sectionOptionHeading),
      then(synonym.pipe(manySepBy("・"), called("synonym options"))),
      map((tokens) => {
        const [heading, contents] = tokens;
        return tokenFactory.firstLevelDefinition(contents, heading);
      }),
      called("synonym section")
    );
  };

  return synonymSectionHeading.pipe(
    then(section().pipe(manySepBy("／"), called("synonym groups"))),
    flatten(),
    map((tokens) => {
      return tokenFactory.synonymSection(tokens);
    }),
    called("synonymSection")
  );
};

// https://en.wikipedia.org/wiki/Clitic?oldid=492213497
export const cliticSection = cliticSectionHeading.pipe(
  then(
    p.noCharOf("・").pipe(
      //
      many(),
      stringify(),
      manySepBy("・")
    )
  ),
  flatten(),
  map((tokens) => {
    const [heading, ...rest] = tokens;
    return tokenFactory.cliticSection(heading, rest);
  })
);

export const definitionChar = level1Heading.pipe(
  or(level2Heading, level3Heading, synonymSectionHeading, cliticSectionHeading),
  not(),
  qthen(linebreak.pipe(or(literalQuote, p.anyChar()))),
  called("definitionChar")
);

const level3 = level3Heading.pipe(
  then(
    definitionChar.pipe(
      //
      many(),
      map(joinSuccessiveStringTokens),
      called("level3 content")
    )
  ),
  called("level3"),
  map((tokens) => {
    const [heading, content] = tokens;
    return tokenFactory.thirdLevelDefinition(content, heading);
  })
);

const level2 = level2Heading.pipe(
  then(
    level3.pipe(
      or(definitionChar), //
      many(),
      map(joinSuccessiveStringTokens),
      called("level2 content")
    )
  ),
  called("level2"),
  map((tokens) => {
    const [i, content] = tokens;
    const heading = `(${i})`;
    return tokenFactory.secondLevelDefinition(i, content, heading);
  })
);

const level1 = level1Heading.pipe(
  then(
    //
    definitionChar.pipe(
      //
      or(level2),
      many(),
      map(joinSuccessiveStringTokens),
      called("level1 content")
    )
  ),
  called("level1"),
  map((tokens) => {
    const [heading, contents] = tokens;
    return tokenFactory.firstLevelDefinition(contents, heading);
  })
);

// in daijisen, [一] etc mark a distinction between different parts of speech
// for the same word e.g. here you can see one - a distinction between a noun
// and an adjective
//
// http://localhost:4000/#/dict/%E5%A4%A7%E8%BE%9E%E6%B3%89/prefix/%E4%B8%80%E7%AD%8B/0
//
// this distinction is not very useful for formatting but it's good to
// understand the (supposed) reasoning behind it
const daijisenDefinition = level1.pipe(
  or(
    synonymSection(),
    level2.pipe(attempt()),
    linebreak,
    cliticSection,
    p.anyChar()
  ),
  many(),
  map(joinSuccessiveStringTokens),
  called("definition")
);
