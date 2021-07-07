import * as p from "parjs";
import { many, map, mapConst, or, stringify } from "parjs/combinators";
import { called } from "../parseUtils";

export const tokenFactory = {
  firstLevelDefinition: (content, heading) => ({
    type: "firstLevelDefinition",
    content: content,
    heading: heading,
  }),
  secondLevelDefinition: (i, content, heading) => ({
    type: "secondLevelDefinition",
    number: i,
    content: content,
    heading: heading,
  }),
  thirdLevelDefinition: (content, heading) => ({
    type: "thirdLevelDefinition",
    content: content,
    heading: heading,
  }),
};

export const linebreak = p.newline().pipe(mapConst({ type: "linebreak" }));

const numbers =
  "⓪①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚㉛㉜㉝㉞㉟㊱㊲㊳㊴㊵㊶㊷㊸㊹㊺㊻㊼㊽㊾㊿";

export const whiteCircledNumber = () => {
  const conversions = numbers.split("").reduce((result, char, i) => {
    result[char] = i;
    return result;
  }, {});

  return p.anyCharOf(numbers).pipe(
    map((parsedChar) => {
      return { number: conversions[parsedChar], char: parsedChar };
    }),
    called("whiteCircledNumber")
  );
};

export const fullWidthNumber = () => {
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

export const katakanaToken = p
  .anyCharOf(
    "アイウエオカガキギクグケゲコゴサザシジスズセゼソゾ" +
      "タダチヂツヅテデトドナニヌネノハバパヒビピフブプ" +
      "ヘベペホボポマミムメモヤユヨラリルレロワヰヱヲンヴヷヸヹヺ"
  )
  .pipe(called("katakanaToken"));

export const kanjiNumber = p
  .anyCharOf("一二三四五六七八九十")
  .pipe(called("kanjiNumber"));

export const blackCircledNumber = p
  .anyCharOf("⓿❶❷❸❹❺❻❼❽❾❿⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴")
  .pipe(called("blackCircledNumber"));

export const circledKatakanaToken = p
  .anyCharOf(
    "㋐㋑㋒㋓㋔㋕㋖㋗㋘㋙㋚㋛㋜㋝㋞㋟㋠㋡㋢㋣㋤㋥㋦㋧㋨㋩㋪㋫㋬㋭㋮㋯㋰㋱㋲㋳㋴㋵㋶㋷㋸㋹㋺㋻㋼㋽㋾"
  )
  .pipe(called("circledKatakanaToken"));
