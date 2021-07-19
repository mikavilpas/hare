/* eslint-disable jest/valid-expect */

import { assertFailsParsing, assertParses } from "../testUtils";
import { definitionChar, level4, tokenize } from "./daijirin";

describe("heading or regular quote", () => {
  it("can parse a part of speech", () => {
    // const text = `（名）`;
    const text = `（名）`;
    assertParses(tokenize(text), [text]);
  });

  it("can parse a heading", () => {
    const text = `（１）`;
    assertParses(tokenize(text), [
      {
        type: "thirdLevelDefinition",
        content: [],
        heading: "(1)",
      },
    ]);
  });
});

describe("top level definition parsing", () => {
  it("can parse 1st and second levels", () => {
    // https://sakura-paris.org/dict/大辞林/prefix/もの
    const text = `
■一■ [2][0] （名）
〔形である〕
□一□
（１）物体。
`;
    assertParses(tokenize(text), [
      {
        type: "linebreak",
      },
      {
        type: "firstLevelDefinition",
        content: [
          " [2][0] （名）",
          {
            type: "linebreak",
          },
          "〔形である〕",
          {
            type: "linebreak",
          },
          {
            type: "secondLevelDefinition",
            number: "一",
            content: [
              {
                type: "linebreak",
              },
              {
                type: "thirdLevelDefinition",
                content: [
                  "物体。",
                  {
                    type: "linebreak",
                  },
                ],
                heading: "(1)",
              },
            ],
            heading: "(一)",
          },
        ],
        heading: "(一)",
      },
    ]);
  });

  it("1st level can contain 3rd level", () => {
    const text = `
■二■ （接頭） 名詞に付く。
（１）何も持っていない，何も伴っていない意を表す。「―手」「―身」
`;
    assertParses(tokenize(text), [
      {
        type: "linebreak",
      },
      {
        type: "firstLevelDefinition",
        content: [
          " （接頭） 名詞に付く。",
          {
            type: "linebreak",
          },
          {
            type: "thirdLevelDefinition",
            content: [
              "何も持っていない，何も伴っていない意を表す。",
              {
                content: ["「―手」"],
                innerQuote: "―手",
                type: "exampleSentence",
              },
              {
                content: ["「―身」"],
                innerQuote: "―身",
                type: "exampleSentence",
              },
              {
                type: "linebreak",
              },
            ],
            heading: "(1)",
          },
        ],
        heading: "(二)",
      },
    ]);
  });

  it("can parse top level definition symbols", () => {
    const text = `■一■ （副）スル □二□ （名） `;
    assertParses(tokenize(text), [
      {
        type: "firstLevelDefinition",
        content: [
          " （副）スル ",
          {
            type: "secondLevelDefinition",
            number: "二",
            content: [" （名） "],
            heading: "(二)",
          },
        ],
        heading: "(一)",
      },
    ]);
  });

  it("can parse alternate top level definition symbols", () => {
    // not sure why there are two options...
    const text = `❶ （副）スル ❷ （名） `;
    assertParses(tokenize(text), [
      {
        type: "secondLevelDefinition",
        number: "❶",
        content: [" （副）スル "],
        heading: "(❶)",
      },
      {
        type: "secondLevelDefinition",
        number: "❷",
        content: [" （名） "],
        heading: "(❷)",
      },
    ]);
  });

  it("definition with some text after it", () => {
    const text =
      "（１）ある物事を一緒になってする者。「―に入る」「―を裏切る」「遊び―」";
    assertParses(tokenize(text), [
      {
        type: "thirdLevelDefinition",
        content: [
          "ある物事を一緒になってする者。",
          {
            content: ["「―に入る」"],
            innerQuote: "―に入る",
            type: "exampleSentence",
          },
          {
            content: ["「―を裏切る」"],
            innerQuote: "―を裏切る",
            type: "exampleSentence",
          },
          {
            content: ["「遊び―」"],
            innerQuote: "遊び―",
            type: "exampleSentence",
          },
        ],
        heading: "(1)",
      },
    ]);
  });

  it("many definitions", () => {
    const text = `なか-ま [3] 【仲間】
（１）ある物事を一緒になってする者。「―に入る」「―を裏切る」「遊び―」
（２）同じ種類に属するもの。同類。「鯨は哺乳類の―であって，魚の―ではない」
（３）近世，商工業者が結成した同業組合。
`;
    assertParses(tokenize(text), [
      "なか-ま [3] 【仲間】",
      {
        type: "linebreak",
      },
      {
        type: "thirdLevelDefinition",
        content: [
          "ある物事を一緒になってする者。",
          {
            content: ["「―に入る」"],
            innerQuote: "―に入る",
            type: "exampleSentence",
          },
          {
            content: ["「―を裏切る」"],
            innerQuote: "―を裏切る",
            type: "exampleSentence",
          },
          {
            content: ["「遊び―」"],
            innerQuote: "遊び―",
            type: "exampleSentence",
          },
          {
            type: "linebreak",
          },
        ],
        heading: "(1)",
      },
      {
        type: "thirdLevelDefinition",
        content: [
          "同じ種類に属するもの。同類。",
          {
            content: ["「鯨は哺乳類の―であって，魚の―ではない」"],
            innerQuote: "鯨は哺乳類の―であって，魚の―ではない",
            type: "exampleSentence",
          },
          {
            type: "linebreak",
          },
        ],
        heading: "(2)",
      },
      {
        type: "thirdLevelDefinition",
        content: [
          "近世，商工業者が結成した同業組合。",
          {
            type: "linebreak",
          },
        ],
        heading: "(3)",
      },
    ]);
  });

  it("two levels of definitions", () => {
    const text = `[keyword]ぞく・する[/keyword] [3] 【属する】 （動サ変）[文]サ変 ぞく・す
□一□（自動詞）
（１）ある集団に加わっている。「野球部に―・している」
（２）ある種類・範囲・分類の中にある。「哺乳類に―・する動物」
□二□（他動詞）
（１）文章を書く。「稿を―・するは，大抵夜間/即興詩人（鴎外）」
（２）依頼する。たのむ。嘱(シヨク)する。「閻王此偈を誦じをはて，すなはち彼文を尊恵に―・す/平家 6」
`;
    assertParses(tokenize(text), [
      "[keyword]ぞく・する[/keyword] [3] 【属する】 （動サ変）[文]サ変 ぞく・す",
      {
        type: "linebreak",
      },
      {
        type: "secondLevelDefinition",
        number: "一",
        content: [
          "（自動詞）",
          {
            type: "linebreak",
          },
          {
            type: "thirdLevelDefinition",
            content: [
              "ある集団に加わっている。",
              {
                content: ["「野球部に―・している」"],
                innerQuote: "野球部に―・している",
                type: "exampleSentence",
              },
              {
                type: "linebreak",
              },
            ],
            heading: "(1)",
          },
          {
            type: "thirdLevelDefinition",
            content: [
              "ある種類・範囲・分類の中にある。",
              {
                content: ["「哺乳類に―・する動物」"],
                innerQuote: "哺乳類に―・する動物",
                type: "exampleSentence",
              },
              {
                type: "linebreak",
              },
            ],
            heading: "(2)",
          },
        ],
        heading: "(一)",
      },
      {
        type: "secondLevelDefinition",
        number: "二",
        content: [
          "（他動詞）",
          {
            type: "linebreak",
          },
          {
            type: "thirdLevelDefinition",
            content: [
              "文章を書く。",
              {
                content: ["「稿を―・するは，大抵夜間/即興詩人（鴎外）」"],
                innerQuote: "稿を―・するは，大抵夜間/即興詩人（鴎外）",
                type: "exampleSentence",
              },
              {
                type: "linebreak",
              },
            ],
            heading: "(1)",
          },
          {
            type: "thirdLevelDefinition",
            content: [
              "依頼する。たのむ。嘱(シヨク)する。",
              {
                content: [
                  "「閻王此偈を誦じをはて，すなはち彼文を尊恵に―・す/平家 6」",
                ],
                innerQuote:
                  "閻王此偈を誦じをはて，すなはち彼文を尊恵に―・す/平家 6",
                type: "exampleSentence",
              },
              {
                type: "linebreak",
              },
            ],
            heading: "(2)",
          },
        ],
        heading: "(二)",
      },
    ]);
  });

  it("definition in another format", () => {
    const text = `し-まつ [1] 【始末】 （名）スル （１）（物事の）しめくくりを付けること。片付けること。処理。「―を付ける」「このごたごたをどう―するつもりだ」 （２）無駄遣いしないこと。倹約すること。「なんでも―して使う人」「藤屋の市兵衛が申事を尤と思はば，―をすべし/浮世草子・一代男 7」 （３）結果。主として悪い状態についていう。「さんざん迷惑をかけたあげく，あの―だ」 （４）物事の事情。事の次第。「私が此書(ホン)を読む様になりました―は/不如帰（蘆花）」`;
    assertParses(tokenize(text), [
      "し-まつ [1] 【始末】 （名）スル ",
      {
        type: "thirdLevelDefinition",
        content: [
          "（物事の）しめくくりを付けること。片付けること。処理。",
          {
            content: ["「―を付ける」"],
            innerQuote: "―を付ける",
            type: "exampleSentence",
          },
          {
            content: ["「このごたごたをどう―するつもりだ」"],
            innerQuote: "このごたごたをどう―するつもりだ",
            type: "exampleSentence",
          },
          " ",
        ],
        heading: "(1)",
      },
      {
        type: "thirdLevelDefinition",
        content: [
          "無駄遣いしないこと。倹約すること。",
          {
            content: ["「なんでも―して使う人」"],
            innerQuote: "なんでも―して使う人",
            type: "exampleSentence",
          },
          {
            content: [
              "「藤屋の市兵衛が申事を尤と思はば，―をすべし/浮世草子・一代男 7」",
            ],
            innerQuote:
              "藤屋の市兵衛が申事を尤と思はば，―をすべし/浮世草子・一代男 7",
            type: "exampleSentence",
          },
          " ",
        ],
        heading: "(2)",
      },
      {
        type: "thirdLevelDefinition",
        content: [
          "結果。主として悪い状態についていう。",
          {
            content: ["「さんざん迷惑をかけたあげく，あの―だ」"],
            innerQuote: "さんざん迷惑をかけたあげく，あの―だ",
            type: "exampleSentence",
          },
          " ",
        ],
        heading: "(3)",
      },
      {
        type: "thirdLevelDefinition",
        content: [
          "物事の事情。事の次第。",
          {
            content: [
              "「私が此書(ホン)を読む様になりました―は/不如帰（蘆花）」",
            ],
            innerQuote: "私が此書(ホン)を読む様になりました―は/不如帰（蘆花）",
            type: "exampleSentence",
          },
        ],
        heading: "(4)",
      },
    ]);
  });
});

describe("content with no structure", () => {
  it("can parse a definition without a structure", () => {
    const text = `とも-だち [0] 【友達】
一緒に勉強したり仕事をしたり遊んだりして，親しく交わる人。友人。友。朋友(ホウユウ)。「―になる」「遊び―」「女―」
`;
    assertParses(tokenize(text), [
      "とも-だち [0] 【友達】",
      {
        type: "linebreak",
      },
      "一緒に勉強したり仕事をしたり遊んだりして，親しく交わる人。友人。友。朋友(ホウユウ)。",
      {
        content: ["「―になる」"],
        innerQuote: "―になる",
        type: "exampleSentence",
      },
      {
        content: ["「遊び―」"],
        innerQuote: "遊び―",
        type: "exampleSentence",
      },
      {
        content: ["「女―」"],
        innerQuote: "女―",
        type: "exampleSentence",
      },
      {
        type: "linebreak",
      },
    ]);
  });
});

describe("third level definitions", () => {
  it("can parse a third level definition", () => {
    const text = `（１）ある物事を一緒になってする者。「―に入る」「―を裏切る」「遊び―」`;
    assertParses(tokenize(text), [
      {
        type: "thirdLevelDefinition",
        content: [
          "ある物事を一緒になってする者。",
          {
            content: ["「―に入る」"],
            innerQuote: "―に入る",
            type: "exampleSentence",
          },
          {
            content: ["「―を裏切る」"],
            innerQuote: "―を裏切る",
            type: "exampleSentence",
          },
          {
            content: ["「遊び―」"],
            innerQuote: "遊び―",
            type: "exampleSentence",
          },
        ],
        heading: "(1)",
      },
    ]);
  });

  it("can parse two 3rds", () => {
    const text = `（１）あ（２）同じ `;
    assertParses(tokenize(text), [
      {
        type: "thirdLevelDefinition",
        content: ["あ"],
        heading: "(1)",
      },
      {
        type: "thirdLevelDefinition",
        content: ["同じ "],
        heading: "(2)",
      },
    ]);
  });

  it("can parse level 3 followed by level 4", () => {
    const text = `（２）歴史の時代区分の一。中世と近代の間の時期。（ア）日本史では，後期封建制の時期の安土桃山・江戸時代をいう。`;
    assertParses(tokenize(text), [
      {
        type: "thirdLevelDefinition",
        content: [
          "歴史の時代区分の一。中世と近代の間の時期。",
          {
            type: "fourthLevelDefinition",
            content: [
              "日本史では，後期封建制の時期の安土桃山・江戸時代をいう。",
            ],
            heading: "(ア)",
          },
        ],
        heading: "(2)",
      },
    ]);
  });
});

describe("definition token (char)", () => {
  it("fails when parsing definition headings", () => {
    // these failures determine that a definition should be parsed instead
    assertFailsParsing(definitionChar.parse("（ア）"));
    assertFailsParsing(definitionChar.parse("（２）"));
    assertFailsParsing(definitionChar.parse("□一□"));
  });
});

describe("fourth level definitions", () => {
  it("can parse a third level definition", () => {
    const text = `（ア）日本史では，後期封建制の時期の安土桃山・江戸時代をいう。`;
    assertParses(level4.parse(text), {
      type: "fourthLevelDefinition",
      content: ["日本史では，後期封建制の時期の安土桃山・江戸時代をいう。"],
      heading: "(ア)",
    });
  });

  it("can parse three levels of definitions", () => {
    const text = `[keyword]きん-せい[/keyword] [1] 【近世】
□一□（自動詞）
（１）あ
（ア）日本（イ）西
□二□（他動詞）
（１）文章を書く。「稿を―・するは，大抵夜間/即興詩人（鴎外）」
（２）歴史（ア）日本
`;
    assertParses(tokenize(text), [
      "[keyword]きん-せい[/keyword] [1] 【近世】",
      {
        type: "linebreak",
      },
      {
        type: "secondLevelDefinition",
        number: "一",
        content: [
          "（自動詞）",
          {
            type: "linebreak",
          },
          {
            type: "thirdLevelDefinition",
            content: [
              "あ",
              {
                type: "linebreak",
              },
              {
                type: "fourthLevelDefinition",
                content: ["日本"],
                heading: "(ア)",
              },
              {
                type: "fourthLevelDefinition",
                content: [
                  "西",
                  {
                    type: "linebreak",
                  },
                ],
                heading: "(イ)",
              },
            ],
            heading: "(1)",
          },
        ],
        heading: "(一)",
      },
      {
        type: "secondLevelDefinition",
        number: "二",
        content: [
          "（他動詞）",
          {
            type: "linebreak",
          },
          {
            type: "thirdLevelDefinition",
            content: [
              "文章を書く。",
              {
                content: ["「稿を―・するは，大抵夜間/即興詩人（鴎外）」"],
                innerQuote: "稿を―・するは，大抵夜間/即興詩人（鴎外）",
                type: "exampleSentence",
              },
              {
                type: "linebreak",
              },
            ],
            heading: "(1)",
          },
          {
            type: "thirdLevelDefinition",
            content: [
              "歴史",
              {
                type: "fourthLevelDefinition",
                content: [
                  "日本",
                  {
                    type: "linebreak",
                  },
                ],
                heading: "(ア)",
              },
            ],
            heading: "(2)",
          },
        ],
        heading: "(二)",
      },
    ]);
  });
});
