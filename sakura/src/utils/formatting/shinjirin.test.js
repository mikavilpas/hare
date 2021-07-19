/* eslint-disable jest/valid-expect */

import { assertParses } from "../testUtils";
import { tokenize } from "./shinjirin";

describe("definitions", () => {
  it("can parse 1st level heading from bbcode", () => {
    const text = `[keyword]さん【山】[/keyword]`;

    assertParses(tokenize(text), ["[keyword]さん【山】[/keyword]"]);
  });

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
          "ぶらさげる。",
          {
            content: ["「服を―・ける」"],
            innerQuote: "服を―・ける",
            type: "exampleSentence",
          },
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
            content: [
              "…しそうになる。",
              {
                content: ["「おぼれ―・ける」"],
                innerQuote: "おぼれ―・ける",
                type: "exampleSentence",
              },
            ],
            heading: "(ア)",
          },
          {
            type: "thirdLevelDefinition",
            content: [
              "…する途中である。…し始める。",
              {
                content: ["「帰り―・ける」"],
                innerQuote: "帰り―・ける",
                type: "exampleSentence",
              },
            ],
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
          "人数を数える語。",
          {
            content: ["「親子 3―」"],
            innerQuote: "親子 3―",
            type: "exampleSentence",
          },
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
              "いま現に問題にしているもの，当面のものである意を表す。",
              {
                content: ["「―席」"],
                innerQuote: "―席",
                type: "exampleSentence",
              },
              {
                content: ["「―事件」"],
                innerQuote: "―事件",
                type: "exampleSentence",
              },
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
              "話している自分にかかわるものであることを表す。",
              {
                content: ["「―官」"],
                innerQuote: "―官",
                type: "exampleSentence",
              },
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
            content: [
              "普遍的な傾向。",
              {
                content: ["「人はお世辞に弱い―だ」"],
                innerQuote: "人はお世辞に弱い―だ",
                type: "exampleSentence",
              },
            ],
            heading: "(ア)",
          },
          {
            type: "thirdLevelDefinition",
            content: [
              "なすべきこと。",
              {
                content: ["「そんな時は許してやる―だ」"],
                innerQuote: "そんな時は許してやる―だ",
                type: "exampleSentence",
              },
            ],
            heading: "(イ)",
          },
          {
            type: "thirdLevelDefinition",
            content: [
              "過去にしばしば起こったこと。",
              {
                content: ["「よく遊んだ―だ」"],
                innerQuote: "よく遊んだ―だ",
                type: "exampleSentence",
              },
            ],
            heading: "(ウ)",
          },
          {
            type: "thirdLevelDefinition",
            content: [
              "感動・詠嘆を表す。…なあ。",
              {
                content: ["「故郷とはいい―だ」"],
                innerQuote: "故郷とはいい―だ",
                type: "exampleSentence",
              },
            ],
            heading: "(エ)",
          },
        ],
        heading: "(1)",
      },
    ]);
  });
});
