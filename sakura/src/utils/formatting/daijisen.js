import * as p from "parjs";
import { between, many, map, not, or, qthen, then } from "parjs/combinators";
import { joinSuccessiveStringTokens } from "../parseUtils";
import { literalQuote } from "./formatting";
import { linebreak, tokenFactory } from "./tokens";

export function tokenize(text) {
  const tokens = daijisenDefinition.parse(text);
  return tokens;
}

const level1Heading = p.anyStringOf("[一]", "[二]");
const level2Heading = p.int().pipe(between("(", ")"));
const level3Heading = p.anyCharOf(
  "㋐㋑㋒㋓㋔㋕㋖㋗㋘㋙㋚㋛㋜㋝㋞㋟㋠㋡㋢㋣㋤㋥㋦㋧㋨㋩㋪㋫㋬㋭㋮㋯㋰㋱㋲㋳㋴㋵㋶㋷㋸㋹㋺㋻㋼㋽㋾"
);

export const definitionChar = level1Heading.pipe(
  or(level2Heading, level3Heading),
  not(),
  qthen(linebreak.pipe(or(literalQuote, p.anyChar())))
);

const level3 = level3Heading.pipe(
  then(
    definitionChar.pipe(
      //
      many(),
      map(joinSuccessiveStringTokens)
    )
  ),
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
      map(joinSuccessiveStringTokens)
    )
  ),
  map((tokens) => {
    const [i, content] = tokens;
    const heading = `(${i})`;
    return tokenFactory.secondLevelDefinition(i, content, heading);
  })
);

const level1 = level1Heading.pipe(
  then(
    //
    level2.pipe(
      //
      or(definitionChar),
      many(),
      map(joinSuccessiveStringTokens)
    )
  ),
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
    level2, // if this doesn't work then fall back to "whatever content is okay"
    linebreak,
    p.anyChar()
  ),
  many(),
  map(joinSuccessiveStringTokens)
);
