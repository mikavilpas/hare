import * as p from "parjs";
import { many, map, not, or, qthen, then } from "parjs/combinators";
import { joinSuccessiveStringTokens } from "../parseUtils";
import { literalQuote } from "./formatting";
import { linebreak, tokenFactory } from "./tokens";

// 広辞苑
export function tokenize(text) {
  const tokens = definition.parse(text);
  return tokens;
}

const numbers =
  "⓪①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚㉛㉜㉝㉞㉟㊱㊲㊳㊴㊵㊶㊷㊸㊹㊺㊻㊼㊽㊾㊿";

const whiteCircledNumber = () => {
  const conversions = numbers.split("").reduce((result, char, i) => {
    result[char] = i;
    return result;
  }, {});

  return p.anyCharOf(numbers).pipe(
    map((parsedChar) => {
      return conversions[parsedChar];
    })
  );
};

const level1Heading = whiteCircledNumber();

const definitionChar = level1Heading.pipe(
  not(),
  qthen(linebreak.pipe(or(literalQuote, p.anyChar())))
);

const level1 = level1Heading.pipe(
  then(definitionChar.pipe(many(), map(joinSuccessiveStringTokens))),
  map((tokens) => {
    const [index, content] = tokens;
    const heading = `(${index})`;
    return tokenFactory.firstLevelDefinition(content, heading);
  })
);

const definition = level1.pipe(
  or(linebreak, p.anyChar()),
  many(),
  map(joinSuccessiveStringTokens)
);
