import * as p from "parjs";
import {
  between,
  many,
  map,
  maybe,
  or,
  stringify,
  then,
  thenq,
} from "parjs/combinators";

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

const quoted = (sepA, sepB) => {
  return p.noCharOf([sepA, sepB]).pipe(
    //
    many(),
    between(sepA, sepB),
    stringify()
  );
};

const quotedText = quoted("【", "】").pipe(
  // different dictionaries have various ways of quoting
  or(
    quoted("〖", "〗"), //
    quoted("{", "}"),
    quoted("（", "）"),
    quoted("〔", "〕")
  )
);

// parses a heading with only kana, no kanji part.
//
// け‐ども
const kanaHeadingPart = wordChar.pipe(
  //
  many(),
  stringify(),
  map((str) => ({ kana: normalize(str) }))
);

// parses the kanji part of a heading, such as
//
// 【捜査】サウ‥
const kanjiHeadingPart = quotedText.pipe(
  thenq(p.anyChar().pipe(many())), // ignore the rest
  map((insideQuotes) => {
    const kanjiOptions = insideQuotes
      .replaceAll("△", "")
      .replaceAll("×", "")
      .replaceAll("＝", "")
      .split("・")
      .map((str) => normalize(str));

    return {
      kanjiOptions: kanjiOptions,
    };
  })
);

// all kanji headings start with the kana, followed by optional quoted kanji
const heading = kanaHeadingPart.pipe(
  then(kanjiHeadingPart.pipe(maybe({ kanjiOptions: [] }))),
  map(([kana, kanji]) => {
    return { ...kana, ...kanji };
  })
);
