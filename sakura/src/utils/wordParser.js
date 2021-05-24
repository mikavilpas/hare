import * as p from "parjs";
import {
  between,
  many,
  manySepBy,
  map,
  or,
  qthen,
  thenq,
  stringify,
  then,
} from "parjs/combinators";

export function parse(inputText) {
  try {
    const parseResult = heading.parse(inputText);
    return parseResult;
  } catch (_error) {
    throw _error;
  }
}

export const wordChar = p.noCharOf("【】〖〗{}（）〔〕()");

const quoted = (sepA, sepB) => {
  return wordChar.pipe(
    //
    many(),
    between(sepA, sepB),
    stringify()
  );
};

export const quotedText = quoted("【", "】").pipe(
  // different dictionaries have various ways of quoting
  or(
    quoted("〖", "〗"), //
    quoted("{", "}"),
    quoted("（", "）"),
    quoted("〔", "〕"),
    quoted("(", ")")
  )
);

export const heading = wordChar.pipe(
  //
  many(),
  qthen(quotedText),
  thenq(p.anyChar().pipe(many())),
  map((str) => str.replace("△", "").replace("×", "")),
  map((wordString) => ({
    kanjiOptions: wordString.split("・"),
  }))
);
