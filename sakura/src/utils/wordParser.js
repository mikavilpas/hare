import uniq from "lodash/uniq";
import * as p from "parjs";
import {
  between,
  flatten,
  many,
  manySepBy,
  map,
  maybe,
  must,
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

// https://www.fileformat.info/info/unicode/char/3000/index.htm
const fullWidthSpace = "　";

const normalize = (str) =>
  str
    .replaceAll(/[‐・-]/g, "")
    .replaceAll("●", "")
    .replaceAll("=", "")
    .replaceAll(fullWidthSpace, "");
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

// parse the quoted section of e.g. 【掛ける（懸ける・架ける・賭ける）】
//                                          ^^^^^^^^^^^^^^^^^^^^
export const innerListingOfAlternateParts = kanjiChar.pipe(
  many(),
  stringify(),
  manySepBy("・"),
  between("（", "）"),
  // distinguish between an optional kanji and this parser
  must((tokens) => tokens?.length > 1),
  map((tokens) => {
    return tokens.map((a) => ({ type: "literalOption", text: a }));
  }),
  called("innerListingOfAlternateParts")
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
    or(innerListingOfAlternateParts.pipe(attempt()), alternativePart),
    many(),
    flatten(),
    map((tokens) => joinSuccessiveStringTokens(tokens))
  );

  return inKanjiQuotes(either.pipe(manySepBy("・"))).pipe(
    //
    map((kanjiWords) => {
      // return all possible combinations of mandatory and optional elements for
      // each kanjiWord
      const combinations = kanjiWords.flatMap((kanjiWord) => {
        const literals = kanjiWord
          .filter((k) => k?.type === "literalOption")
          .map((k) => k.text);
        const options = kanjiWord
          .filter((k) => k?.type !== "literalOption")
          .reduce(
            (result, token) => {
              if (typeof token === "string") {
                return result.map((k) => k + token);
              } else {
                return result.flatMap((k) => [...result, k + token.text]);
              }
            },
            [""]
          );
        return [...literals, ...options];
      });
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
