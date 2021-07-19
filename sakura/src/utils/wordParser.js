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
import { attempt } from "./formatting/formatting";
import { called, joinSuccessiveStringTokens } from "./parseUtils";

export function parse(inputText) {
  try {
    const parseResult = heading.parse(inputText);
    if (parseResult?.kind.toLowerCase() !== "ok") {
      console.warn("wordParser error", parseResult);
    }
    return parseResult;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const normalize = (str) =>
  str.replaceAll(/[‐・-]/g, "").replaceAll("●", "").replaceAll("=", "");
const wordChar = p.noCharOf("【】〖〗{}（）〔〕");
const kanjiChar = p.noCharOf("・【】〖〗{}（）〔〕()");

const inKanjiQuotes = (parser) => {
  return parser.pipe(between("【", "】")).pipe(
    or(
      parser.pipe(between("【", "】")),
      parser.pipe(between("〖", "〗")),
      parser.pipe(
        between("{{", "}}"),
        map((inside) => [[`{{${inside}}}`]])
      ),
      parser.pipe(between("{", "}")),
      parser.pipe(between("（", "）")),
      parser.pipe(between("〔", "〕")),
      parser.pipe(between("(", ")"))
    )
  );
};

// parses a heading with only kana, no kanji part.
//
// け‐ども
const kanaHeadingPart = wordChar.pipe(
  //
  many(),
  stringify(),
  map((str) => ({ kana: normalize(str) })),
  called("kanaHeadingPart")
);

const alternativeKanjiSpellings = () => {
  const compulsoryPart = kanjiChar.pipe(called("compulsoryPart"));
  const alternativePart = inKanjiQuotes(
    compulsoryPart.pipe(attempt(), many(), stringify())
  ).pipe(
    map((a) => ({ type: "optional", text: a })),
    called("alternativePart")
  );

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
    }),
    called("alternativeKanjiSpellings")
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
  }),
  called("kanjiHeadingPart")
);

// all kanji headings start with the kana, followed by optional quoted kanji
const heading = kanaHeadingPart.pipe(
  then(
    kanjiHeadingPart.pipe(
      maybe({ kanjiOptions: [] }),
      called("optional kanji spellings")
    )
  ),
  map(([kana, kanji]) => {
    return { ...kana, ...kanji };
  }),
  called("kanji heading")
);
