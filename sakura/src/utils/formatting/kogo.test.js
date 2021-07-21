/* eslint-disable jest/valid-expect */

import { assertParses } from "../testUtils";
import { tokenize } from "./kogo";

describe("definition parsing", () => {
  it("can parse a 2nd level heading", () => {
    const text = `
❶[decoration]空高く飛ぶ。[/decoration]
`;
    assertParses(tokenize(text), [
      {
        type: "secondLevelDefinition",
        number: 0,
        content: [
          "[decoration]空高く飛ぶ。[/decoration]",
          {
            type: "linebreak",
          },
        ],
        heading: "❶",
      },
    ]);
  });

  it("can parse 2nd level heading and content", () => {
    const text = `
❶[decoration]空高く飛ぶ。[/decoration]
《[reference]竹取物語[/reference page=2406,offset=132]・かぐや姫の昇天》 「つゆも、物空にかけらば」
《訳》
ちょっとでも物が空に高く飛んだら。
❷[decoration]飛ぶように速く走る。[/decoration]
`;
    assertParses(tokenize(text), [
      {
        type: "secondLevelDefinition",
        number: 0,
        content: [
          "[decoration]空高く飛ぶ。[/decoration]",
          {
            type: "linebreak",
          },
          "《[reference]竹取物語[/reference page=2406,offset=132]・かぐや姫の昇天》 ",
          {
            content: ["「つゆも、物空にかけらば」"],
            innerQuote: "つゆも、物空にかけらば",
            type: "exampleSentence",
          },
          {
            type: "linebreak",
          },
          "《訳》",
          {
            type: "linebreak",
          },
          "ちょっとでも物が空に高く飛んだら。",
        ],
        heading: "❶",
      },
      {
        type: "secondLevelDefinition",
        number: 0,
        content: [
          "[decoration]飛ぶように速く走る。[/decoration]",
          {
            type: "linebreak",
          },
        ],
        heading: "❷",
      },
    ]);
  });

  it("can parse a 1st level -> 2nd level definition", () => {
    // http://localhost:4000/#/export/古語/prefix/次/7
    const text = `
㊀《名詞》
❶(地位・身分などが)
❷子孫。
いよい
㊁《副詞》
次から
`;
    assertParses(tokenize(text), [
      {
        type: "firstLevelDefinition",
        content: [
          "《名詞》",
          {
            type: "secondLevelDefinition",
            number: 0,
            content: ["(地位・身分などが)"],
            heading: "❶",
          },
          {
            type: "secondLevelDefinition",
            number: 0,
            content: [
              "子孫。",
              {
                type: "linebreak",
              },
              "いよい",
            ],
            heading: "❷",
          },
        ],
        heading: "㊀",
      },
      {
        type: "firstLevelDefinition",
        content: [
          "《副詞》",
          {
            type: "linebreak",
          },
          "次から",
          {
            type: "linebreak",
          },
        ],
        heading: "㊁",
      },
    ]);
  });
});
