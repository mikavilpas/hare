/* eslint-disable jest/valid-expect */

import { assertParses } from "../testUtils";
import { tokenize } from "./formatting";

describe("quote parsing", () => {
  it("can parse a quote", () => {
    assertParses(tokenize("「あなた―に話す」"), [
      {
        content: ["「あなた―に話す」"],
        innerQuote: "あなた―に話す",
        type: "exampleSentence",
      },
    ]);
  });

  it("can parse two quotes", () => {
    assertParses(tokenize("「あなた―に話す」「二人―で話したい」"), [
      {
        content: ["「あなた―に話す」"],
        innerQuote: "あなた―に話す",
        type: "exampleSentence",
      },
      {
        content: ["「二人―で話したい」"],
        innerQuote: "二人―で話したい",
        type: "exampleSentence",
      },
    ]);
  });

  it("can parse text", () => {
    const input = "（１）それに限定する意を表す。";
    assertParses(tokenize(input), [input]);
  });

  it("can parse mixed definition text and quotes", () => {
    const text =
      "（１）それに限定する意を表す。「あなた―に話す」「二人―で話したい」「ちょっと庭へ出る―だ」「形式―整ってもだめだ」 ";

    assertParses(tokenize(text), [
      "（１）それに限定する意を表す。",
      {
        content: ["「あなた―に話す」"],
        innerQuote: "あなた―に話す",
        type: "exampleSentence",
      },
      {
        content: ["「二人―で話したい」"],
        innerQuote: "二人―で話したい",
        type: "exampleSentence",
      },
      {
        content: ["「ちょっと庭へ出る―だ」"],
        innerQuote: "ちょっと庭へ出る―だ",
        type: "exampleSentence",
      },
      {
        content: ["「形式―整ってもだめだ」"],
        innerQuote: "形式―整ってもだめだ",
        type: "exampleSentence",
      },
      " ",
    ]);
  });

  it("ignores '（）' blocks", () => {
    const text =
      "うつ-ろ [0] 【空ろ・虚ろ】 （名・形動）[文]ナリ （１）（「洞」 とも書く）中がからで何もない・こと（さま）。がらんどう。うろ。 「根もとの方が―になっている」";
    assertParses(tokenize(text), [
      "うつ-ろ [0] 【空ろ・虚ろ】 （名・形動）[文]ナリ （１）（「洞」 とも書く）中がからで何もない・こと（さま）。がらんどう。うろ。 ",
      {
        content: ["「根もとの方が―になっている」"],
        innerQuote: "根もとの方が―になっている",
        type: "exampleSentence",
      },
    ]);
  });

  it("ignores '〔〕' blocks", () => {
    assertParses(tokenize("―な／―に 〔「ろ」は接辞。空洞の意〕 "), [
      "―な／―に 〔「ろ」は接辞。空洞の意〕 ",
    ]);
  });

  it("ignores '()' blocks", () => {
    const text = "③〔建〕(「端」 とも書く) ";
    assertParses(tokenize(text), [text]);
  });
});
