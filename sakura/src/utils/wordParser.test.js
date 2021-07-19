/* eslint-disable jest/valid-expect */

import { assertParses } from "./testUtils";
import * as wordParser from "./wordParser";

describe("can parse headings", () => {
  it("simple base case", () => {
    assertParses(wordParser.parse("じき【磁気】（和英）"), {
      kanjiOptions: ["磁気"],
      kana: "じき",
    });
  });

  it("case with a hyphen in the kana", () => {
    assertParses(wordParser.parse("そう‐さ【捜査】サウ‥"), {
      kanjiOptions: ["捜査"],
      kana: "そうさ",
    });
  });

  it("case with a = in the kana", () => {
    assertParses(wordParser.parse("そう=さ【捜査】サウ‥"), {
      kanjiOptions: ["捜査"],
      kana: "そうさ",
    });
  });

  it("case with kanji having a symbol in between", () => {
    assertParses(wordParser.parse("いぬ‐くぼう【犬△公方】‐クバウ"), {
      kanjiOptions: ["犬公方"],
      kana: "いぬくぼう",
    });
  });

  it("case with a 'bad' kanjified word", () => {
    assertParses(wordParser.parse("いぬ‐こうじゅ【犬香×】‐カウジユ"), {
      kanjiOptions: ["犬香"],
      kana: "いぬこうじゅ",
    });
  });

  it("case with two kanji options", () => {
    assertParses(wordParser.parse("いぬ【犬・狗】"), {
      kanjiOptions: ["犬", "狗"],
      kana: "いぬ",
    });
  });

  it("case with no kanji", () => {
    assertParses(wordParser.parse("け‐ども"), {
      kana: "けども",
      kanjiOptions: [],
    });
  });

  it("case with kanji that has alternate forms", () => {
    assertParses(wordParser.parse("なり-た・つ【成(り)立つ】"), {
      kanjiOptions: ["成立つ", "成り立つ"],
      kana: "なりたつ",
    });
  });

  it("case with weird leading symbol", () => {
    assertParses(wordParser.parse("●幸いする"), {
      kana: "幸いする",
      kanjiOptions: [],
    });
  });

  it("case with alternate kanji spellings", () => {
    assertParses(wordParser.parse("さいわい‐おり【幸い織（り）】さいはひ‐"), {
      kana: "さいわいおり",
      kanjiOptions: ["幸い織", "幸い織り"],
    });
  });

  it("case with complicated alternate kanji spellings", () => {
    assertParses(
      wordParser.parse(
        "さいわい‐おり【aaa（り）bbb（り）・ccc（り）ddd（り）eee】さいはひ‐"
      ),
      {
        kana: "さいわいおり",
        kanjiOptions: [
          "aaabbb",
          "aaaりbbb",
          "aaabbbり",
          "aaaりbbbり",
          "cccdddeee",
          "cccりdddeee",
          "cccdddりeee",
          "cccりdddりeee",
        ],
      }
    );
  });

  it("can parse headings with custom kanji in them ", () => {
    assertParses(
      wordParser.parse("さんじっこくよふねのはじまり【三十石{{zcc4d}}始】"),
      {
        kana: "さんじっこくよふねのはじまり",
        kanjiOptions: ["三十石始", "三十石{{zcc4d}}始"],
      }
    );
  });

  it("can parse headings with only a custom kanji in them ", () => {
    assertParses(wordParser.parse("{{zbe4b}}"), {
      kana: "",
      kanjiOptions: ["{{zbe4b}}"],
    });
  });
});
