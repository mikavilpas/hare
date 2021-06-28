import uniq from "lodash/uniq";
import * as p from "parjs";
import {
  between,
  many,
  manySepBy,
  map,
  maybe,
  or,
  stringify,
  then,
  thenq,
} from "parjs/combinators";
import { joinSuccessiveStringTokens } from "./parseUtils";

export function parse(inputText) {
  try {
    const parseResult = heading.parse(inputText);
    return parseResult;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const normalize = (str) => str.replaceAll(/[‐・-]/g, "").replaceAll("●", "");
const wordChar = p.noCharOf("【】〖〗{}（）〔〕");
const kanjiChar = p.noCharOf("・【】〖〗{}（）〔〕()");

const quoted = (sepA, sepB) => {
  return p.noCharOf([sepA, sepB]).pipe(
    //
    many(),
    between(sepA, sepB),
    stringify()
  );
};

const inKanjiQuotes = (parser) => {
  const a = parser.pipe(between("【", "】"));
  const b = parser.pipe(between("【", "】"));
  const c = parser.pipe(between("〖", "〗"));
  const d = parser.pipe(between("{", "}"));
  const e = parser.pipe(between("（", "）"));
  const f = parser.pipe(between("〔", "〕"));
  const g = parser.pipe(between("(", ")"));

  return a.pipe(or(b, c, d, e, f, g));
};

// parses a heading with only kana, no kanji part.
//
// け‐ども
const kanaHeadingPart = wordChar.pipe(
  //
  many(),
  stringify(),
  map((str) => ({ kana: normalize(str) }))
);

const alternativeKanjiSpellings = () => {
  const compulsoryPart = kanjiChar;
  const alternativePart = inKanjiQuotes(
    compulsoryPart.pipe(many(), stringify())
  ).pipe(map((a) => ({ type: "optional", text: a })));

  const either = compulsoryPart.pipe(
    or(alternativePart),
    many(),
    map((tokens) => joinSuccessiveStringTokens(tokens))
  );

  return inKanjiQuotes(either.pipe(manySepBy("・"))).pipe(
    //
    map((kanjiWords) => {
      // return all possible combinations of mandatory and optional elements for
      // each kanjiWord
      const combinations = kanjiWords.flatMap((kanjiWord) =>
        kanjiWord.reduce(
          (result, token) => {
            if (typeof token === "string") {
              return result.map((k) => k + token);
            } else {
              return result.flatMap((k) => [...result, k + token.text]);
            }
          },
          [""]
        )
      );
      return uniq(combinations);
    })
  );
};

// parses the kanji part of a heading, such as
//
// 【捜査】サウ‥
const kanjiHeadingPart = alternativeKanjiSpellings().pipe(
  thenq(p.anyChar().pipe(many())), // ignore the rest
  map((insideQuotes) => {
    const cleaned = insideQuotes.map((k) =>
      k.replaceAll("△", "").replaceAll("×", "").replaceAll("＝", "")
    );
    return cleaned;
  }),
  map((kanjiOptions) => {
    return { kanjiOptions };
  })
);

// all kanji headings start with the kana, followed by optional quoted kanji
const heading = kanaHeadingPart.pipe(
  then(kanjiHeadingPart.pipe(maybe({ kanjiOptions: [] }))),
  map(([kana, kanji]) => {
    return { ...kana, ...kanji };
  })
);
