/* eslint-disable jest/valid-expect */

import * as wordParser from "./wordParser";

describe("can parse headings", () => {
  it("simple base case", () => {
    expect(wordParser.parse("じき【磁気】（和英）")).to.deep.include({
      value: { kanjiOptions: ["磁気"], kana: "じき" },
    });
  });

  it("case with a hyphen in the kana", () => {
    expect(wordParser.parse("そう‐さ【捜査】サウ‥")).to.deep.include({
      value: { kanjiOptions: ["捜査"], kana: "そうさ" },
    });
  });

  it("case with kanji having a symbol in between", () => {
    expect(wordParser.parse("いぬ‐くぼう【犬△公方】‐クバウ")).to.deep.include({
      value: { kanjiOptions: ["犬公方"], kana: "いぬくぼう" },
    });
  });

  it("case with a 'bad' kanjified word", () => {
    expect(wordParser.parse("いぬ‐こうじゅ【犬香×】‐カウジユ")).to.deep.include(
      {
        value: { kanjiOptions: ["犬香"], kana: "いぬこうじゅ" },
      }
    );
  });

  it("case with two kanji options", () => {
    expect(wordParser.parse("いぬ【犬・狗】")).to.deep.include({
      value: { kanjiOptions: ["犬", "狗"], kana: "いぬ" },
    });
  });

  it("case with no kanji", () => {
    expect(wordParser.parse("け‐ども")).to.deep.include({
      value: { kana: "けども", kanjiOptions: [] },
    });
  });

  it("case with kanji that has alternate forms", () => {
    expect(wordParser.parse("なり-た・つ【成(り)立つ】")).to.deep.include({
      value: {
        kanjiOptions: ["成立つ", "成り立つ"],
        kana: "なりたつ",
      },
    });
  });

  it("case with weird leading symbol", () => {
    expect(wordParser.parse("●幸いする")).to.deep.include({
      value: { kana: "幸いする", kanjiOptions: [] },
    });
  });

  it("case with alternate kanji spellings", () => {
    expect(
      wordParser.parse("さいわい‐おり【幸い織（り）】さいはひ‐")
    ).to.deep.include({
      value: { kana: "さいわいおり", kanjiOptions: ["幸い織", "幸い織り"] },
    });
  });

  it("case with complicated alternate kanji spellings", () => {
    expect(
      wordParser.parse(
        "さいわい‐おり【aaa（り）bbb（り）・ccc（り）ddd（り）eee】さいはひ‐"
      )
    ).to.deep.include({
      value: {
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
      },
    });
  });
});
