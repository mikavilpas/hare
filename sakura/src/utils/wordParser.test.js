/* eslint-disable jest/valid-expect */

import React from "react";
import { mount } from "@cypress/react";
import * as wordParser from "./wordParser";

it("can parse the search result from headings", () => {
  // simple base case
  expect(wordParser.parse("じき【磁気】（和英）")).to.deep.include({
    value: { kanjiOptions: ["磁気"] },
  });

  // case with a hyphen in the kana
  expect(wordParser.parse("そう‐さ【捜査】サウ‥")).to.deep.include({
    value: { kanjiOptions: ["捜査"] },
  });

  // case with kanji having a symbol in between
  expect(wordParser.parse("いぬ‐くぼう【犬△公方】‐クバウ")).to.deep.include({
    value: { kanjiOptions: ["犬公方"] },
  });

  // case with a "bad" kanjified word
  expect(wordParser.parse("いぬ‐こうじゅ【犬香×】‐カウジユ")).to.deep.include({
    value: { kanjiOptions: ["犬香"] },
  });

  // case with two kanji options
  expect(wordParser.parse("いぬ【犬・狗】")).to.deep.include({
    value: { kanjiOptions: ["犬", "狗"] },
  });

  // case with no kanji け‐ども
});
