/* eslint-disable jest/valid-expect */

import { assertParses } from "../parseUtils";
import { tokenize } from "./shinjirin";

describe("definitions", () => {
  it("1st devel definition", () => {
    const text = `か・ける【掛ける】
(１)ぶらさげる。「服を―・ける」
`;
    assertParses(tokenize(text), [
      "か・ける【掛ける】",
      {
        type: "linebreak",
      },
      {
        type: "firstLevelDefinition",
        content: [
          "ぶらさげる。「服を―・ける」",
          {
            type: "linebreak",
          },
        ],
        heading: "(1)",
      },
    ]);
  });

  it("parses definition levels 1->2->3", () => {
    const text = `
(１５)(ア)…しそうになる。「おぼれ―・ける」(イ)…する途中である。…し始める。「帰り―・ける」`;
    assertParses(tokenize(text), [
      {
        type: "linebreak",
      },
      {
        type: "firstLevelDefinition",
        content: [
          {
            type: "thirdLevelDefinition",
            content: ["…しそうになる。「おぼれ―・ける」"],
            heading: "(ア)",
          },
          {
            type: "thirdLevelDefinition",
            content: ["…する途中である。…し始める。「帰り―・ける」"],
            heading: "(イ)",
          },
        ],
        heading: "(15)",
      },
    ]);
  });

  it("parses alternate 1st level", () => {
    const text = `にん【人】
[１]ひと。じん。人柄。
[２]（接尾）
人数を数える語。「親子 3―」
`;
    assertParses(tokenize(text), [
      "にん【人】",
      {
        type: "linebreak",
      },
      {
        type: "firstLevelDefinition",
        content: ["ひと。じん。人柄。"],
        heading: "(1)",
      },
      {
        type: "linebreak",
      },
      {
        type: "firstLevelDefinition",
        content: [
          "（接尾）",
          {
            type: "linebreak",
          },
          "人数を数える語。「親子 3―」",
          {
            type: "linebreak",
          },
        ],
        heading: "(2)",
      },
    ]);
  });

  it("can parse 1->2 levels", () => {
    const text = `[keyword]ほん【本】[/keyword]
[２]（接頭）
名詞に付く。
　　(１)いま現に問題にしているもの，当面のものである意を表す。「―席」「―事件」
　　(２)話している自分にかかわるものであることを表す。「―官」
`;
    assertParses(tokenize(text), [
      "[keyword]ほん【本】[/keyword]",
      {
        type: "linebreak",
      },
      {
        type: "firstLevelDefinition",
        content: [
          "（接頭）",
          {
            type: "linebreak",
          },
          "名詞に付く。",
          {
            type: "linebreak",
          },
          {
            type: "secondLevelDefinition",
            number: 0,
            content: [
              "いま現に問題にしているもの，当面のものである意を表す。「―席」「―事件」",
              {
                type: "linebreak",
              },
            ],
            heading: "(1)",
          },
          {
            type: "secondLevelDefinition",
            number: 0,
            content: [
              "話している自分にかかわるものであることを表す。「―官」",
              {
                type: "linebreak",
              },
            ],
            heading: "(2)",
          },
        ],
        heading: "(2)",
      },
    ]);
  });

  it("can parse complex inner quoting", () => {
    const text = `（だ（で（で）で）で）`;
    assertParses(tokenize(text), [text]);
  });

  it("can parse a double quoted symbol/thing", () => {
    const text = `[keyword]もの【物】[/keyword]
[１]
　{{zbe2e}}`;

    assertParses(tokenize(text), [
      "[keyword]もの【物】[/keyword]",
      {
        type: "linebreak",
      },
      {
        type: "firstLevelDefinition",
        content: [
          {
            type: "linebreak",
          },
          "　{{zbe2e}}",
        ],
        heading: "(1)",
      },
    ]);
  });

  it("can parse levels 2->3", () => {
    const text = `　　(１)（「…ものだ（である）」などの形で）(ア)普遍的な傾向。「人はお世辞に弱い―だ」(イ)なすべきこと。「そんな時は許してやる―だ」(ウ)過去にしばしば起こったこと。「よく遊んだ―だ」(エ)感動・詠嘆を表す。…なあ。「故郷とはいい―だ」`;
    assertParses(tokenize(text), [
      {
        type: "secondLevelDefinition",
        number: 0,
        content: [
          "（「…ものだ（である）」などの形で）",
          {
            type: "thirdLevelDefinition",
            content: ["普遍的な傾向。「人はお世辞に弱い―だ」"],
            heading: "(ア)",
          },
          {
            type: "thirdLevelDefinition",
            content: ["なすべきこと。「そんな時は許してやる―だ」"],
            heading: "(イ)",
          },
          {
            type: "thirdLevelDefinition",
            content: ["過去にしばしば起こったこと。「よく遊んだ―だ」"],
            heading: "(ウ)",
          },
          {
            type: "thirdLevelDefinition",
            content: ["感動・詠嘆を表す。…なあ。「故郷とはいい―だ」"],
            heading: "(エ)",
          },
        ],
        heading: "(1)",
      },
    ]);
  });
});
