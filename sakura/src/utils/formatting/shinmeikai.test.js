/* eslint-disable jest/valid-expect */

import { many } from "parjs/combinators";
import { assertParses } from "../testUtils";
import { definitionChar, exampleSentenceBlock, tokenize } from "./shinmeikai";

describe("definition content", () => {
  it("stops reading when it encounters a level1 heading", () => {
    const text = `bla
[一]more`;

    const parser = definitionChar.pipe(many());
    const failure = parser.parse(text);
    expect(failure?.trace.kind).to.eql("Soft");
    expect(failure?.trace.position).to.eql(3);
  });

  it("stops reading when it encounters a level2 heading", () => {
    const text = `bla (一)more`;

    const parser = definitionChar.pipe(many());
    const failure = parser.parse(text);
    expect(failure?.trace.kind).to.eql("Soft");
    expect(failure?.trace.position).to.eql(4);
  });
});

describe("top level definition", () => {
  it("can parse a tld when it's at the start of a line", () => {
    const text = `かける【掛ける】{{zb560}}
[一][2]:[2]（他下一）`;
    assertParses(tokenize(text), [
      "かける【掛ける】{{zb560}}",
      {
        type: "linebreak",
      },
      {
        type: "firstLevelDefinition",
        content: ["[2]:[2]（他下一）"],
        heading: "[一]",
      },
    ]);
  });

  it("does not parse a tld when it's after the start of a line", () => {
    const text = `かける【掛ける】{{zb560}}
blabla[一][2]:[2]（他下一）`;
    assertParses(tokenize(text), [
      "かける【掛ける】{{zb560}}",
      {
        type: "linebreak",
      },
      "blabla[一][2]:[2]（他下一）",
    ]);
  });

  it("can parse two 1st level definitions", () => {
    const text = `かける【掛ける】{{zb560}}
[一]aaa
[二]bbb
`;
    assertParses(tokenize(text), [
      "かける【掛ける】{{zb560}}",
      {
        type: "linebreak",
      },
      {
        type: "firstLevelDefinition",
        content: ["aaa"],
        heading: "[一]",
      },
      {
        type: "linebreak",
      },
      {
        type: "firstLevelDefinition",
        content: [
          "bbb",
          {
            type: "linebreak",
          },
        ],
        heading: "[二]",
      },
    ]);
  });
});

describe("second level definition", () => {
  it("can parse it", () => {
    const text = `かける【掛ける】{{zb560}} (一)〈どこ・なにニなにヲ―〉 △何かで支え（一部分を固定するようにして）、高所から落ちないようにする。`;
    assertParses(tokenize(text), [
      "かける【掛ける】{{zb560}} ",
      {
        type: "secondLevelDefinition",
        number: 0,
        content: [
          "〈どこ・なにニなにヲ―〉 △何かで支え（一部分を固定するようにして）、高所から落ちないようにする。",
        ],
        heading: "[一]",
      },
    ]);
  });
});

describe("full definitions", () => {
  it("can parse 1st and 2nd levels", () => {
    // http://localhost:4000/#/dict/新明解/prefix/かける/1
    const text = `かける【掛ける】{{zb560}}
[一][2]:[2]（他下一）
(一)〈どこ・なにニなにヲ―〉
(二)〈どこ・なにニなにヲ―〉 人目・ほこり・雨などから防ぐように、外から何かでおおう。
{{zb468}}割る(五)
(七)懸詞（カケコトバ）を言う。
[二]〔接尾語的に〕
(一)その動作を始め、進行している状態にある。
(二)途中まで進行した物事が中断した状態にある。
[表記]「懸ける・《係ける」とも書く。「橋をかける」 「はしごをかける」は、「架ける」とも書く。
`;

    assertParses(tokenize(text), [
      "かける【掛ける】{{zb560}}",
      {
        type: "linebreak",
      },
      {
        type: "firstLevelDefinition",
        content: [
          "[2]:[2]（他下一）",
          {
            type: "linebreak",
          },
          {
            type: "secondLevelDefinition",
            number: 0,
            content: [
              "〈どこ・なにニなにヲ―〉",
              {
                type: "linebreak",
              },
            ],
            heading: "[一]",
          },
          {
            type: "secondLevelDefinition",
            number: 0,
            content: [
              "〈どこ・なにニなにヲ―〉 人目・ほこり・雨などから防ぐように、外から何かでおおう。",
              {
                type: "linebreak",
              },
              "{{zb468}}割る",
            ],
            heading: "[二]",
          },
          {
            type: "secondLevelDefinition",
            number: 0,
            content: [
              {
                type: "linebreak",
              },
            ],
            heading: "[五]",
          },
          {
            type: "secondLevelDefinition",
            number: 0,
            content: ["懸詞（カケコトバ）を言う。"],
            heading: "[七]",
          },
        ],
        heading: "[一]",
      },
      {
        type: "linebreak",
      },
      {
        type: "firstLevelDefinition",
        content: [
          "〔接尾語的に〕",
          {
            type: "linebreak",
          },
          {
            type: "secondLevelDefinition",
            number: 0,
            content: [
              "その動作を始め、進行している状態にある。",
              {
                type: "linebreak",
              },
            ],
            heading: "[一]",
          },
          {
            type: "secondLevelDefinition",
            number: 0,
            content: [
              "途中まで進行した物事が中断した状態にある。",
              {
                type: "linebreak",
              },
              "[表記]",
              {
                content: ["「懸ける・《係ける」"],
                innerQuote: "懸ける・《係ける",
                type: "exampleSentence",
              },
              "とも書く。",
              {
                content: ["「橋をかける」"],
                innerQuote: "橋をかける",
                type: "exampleSentence",
              },
              " ",
              {
                content: ["「はしごをかける」"],
                innerQuote: "はしごをかける",
                type: "exampleSentence",
              },
              "は、",
              {
                content: ["「架ける」"],
                innerQuote: "架ける",
                type: "exampleSentence",
              },
              "とも書く。",
              {
                type: "linebreak",
              },
            ],
            heading: "[二]",
          },
        ],
        heading: "[二]",
      },
    ]);
  });

  it("can change an example sentence block into many example sentences", () => {
    const text = `[keyword]いきおい【勢い】【勢】イキホヒ{{zb560}}[3][/keyword]
[一](一)進行が速まり運動が強まるにつれて、自然に加わる抵抗を排除する力。〔限度を越すと自力では抑えきれない〕
「緒戦の勝利に―を得る／―を△増す（盛り返す・失う）／―に押される／―に乗る／放水の―が弱る／―〔＝相手を倒そうとする力が〕余って土俵の外へ飛び出した／走った―〔＝はずみ〕で植木鉢を割った／―よく〔＝強い勢いで〕…する」
`;
    assertParses(tokenize(text), [
      "[keyword]いきおい【勢い】【勢】イキホヒ{{zb560}}[3][/keyword]",
      {
        type: "linebreak",
      },
      {
        type: "firstLevelDefinition",
        content: [
          {
            type: "secondLevelDefinition",
            number: 0,
            content: [
              "進行が速まり運動が強まるにつれて、自然に加わる抵抗を排除する力。〔限度を越すと自力では抑えきれない〕",
              {
                type: "linebreak",
              },
              {
                type: "exampleSentenceGroup",
                content: [
                  {
                    content: ["「緒戦の勝利に―を得る 」"],
                    innerQuote: "緒戦の勝利に―を得る",
                    type: "exampleSentence",
                  },
                  {
                    content: ["「―を△増す（盛り返す・失う） 」"],
                    innerQuote: "―を△増す（盛り返す・失う）",
                    type: "exampleSentence",
                  },
                  {
                    content: ["「―に押される 」"],
                    innerQuote: "―に押される",
                    type: "exampleSentence",
                  },
                  {
                    content: ["「―に乗る 」"],
                    innerQuote: "―に乗る",
                    type: "exampleSentence",
                  },
                  {
                    content: ["「放水の―が弱る 」"],
                    innerQuote: "放水の―が弱る",
                    type: "exampleSentence",
                  },
                  {
                    content: [
                      "「―〔＝相手を倒そうとする力が〕余って土俵の外へ飛び出した 」",
                    ],
                    innerQuote:
                      "―〔＝相手を倒そうとする力が〕余って土俵の外へ飛び出した",
                    type: "exampleSentence",
                  },
                  {
                    content: ["「走った―〔＝はずみ〕で植木鉢を割った 」"],
                    innerQuote: "走った―〔＝はずみ〕で植木鉢を割った",
                    type: "exampleSentence",
                  },
                  {
                    content: ["「―よく〔＝強い勢いで〕…する 」"],
                    innerQuote: "―よく〔＝強い勢いで〕…する",
                    type: "exampleSentence",
                  },
                ],
              },
              {
                type: "linebreak",
              },
            ],
            heading: "[一]",
          },
        ],
        heading: "[一]",
      },
    ]);
  });
});

describe("example sentence blocks", () => {
  it("can parse a block", () => {
    const text = `「緒戦の勝利に―を得る／―を△増す（盛り返す・失う）／―に押される／―に乗る／放水の―が弱る／―〔＝相手を倒そうとする力が〕余って土俵の外へ飛び出した／走った―〔＝はずみ〕で植木鉢を割った／―よく〔＝強い勢いで〕…する」`;
    assertParses(exampleSentenceBlock.parse(text), {
      type: "exampleSentenceGroup",
      content: [
        {
          content: ["「緒戦の勝利に―を得る 」"],
          innerQuote: "緒戦の勝利に―を得る",
          type: "exampleSentence",
        },
        {
          content: ["「―を△増す（盛り返す・失う） 」"],
          innerQuote: "―を△増す（盛り返す・失う）",
          type: "exampleSentence",
        },
        {
          content: ["「―に押される 」"],
          innerQuote: "―に押される",
          type: "exampleSentence",
        },
        {
          content: ["「―に乗る 」"],
          innerQuote: "―に乗る",
          type: "exampleSentence",
        },
        {
          content: ["「放水の―が弱る 」"],
          innerQuote: "放水の―が弱る",
          type: "exampleSentence",
        },
        {
          content: [
            "「―〔＝相手を倒そうとする力が〕余って土俵の外へ飛び出した 」",
          ],
          innerQuote: "―〔＝相手を倒そうとする力が〕余って土俵の外へ飛び出した",
          type: "exampleSentence",
        },
        {
          content: ["「走った―〔＝はずみ〕で植木鉢を割った 」"],
          innerQuote: "走った―〔＝はずみ〕で植木鉢を割った",
          type: "exampleSentence",
        },
        {
          content: ["「―よく〔＝強い勢いで〕…する 」"],
          innerQuote: "―よく〔＝強い勢いで〕…する",
          type: "exampleSentence",
        },
      ],
    });
  });
});

describe("third level definitions", () => {
  it("can parse 3rd level", () => {
    const text = `(二)〔俗〕〈なに・だれト―〉(Ａ)交尾する。 (Ｂ)性的な関係を持つ。`;
    assertParses(tokenize(text), [
      {
        type: "secondLevelDefinition",
        number: 0,
        content: [
          "〔俗〕〈なに・だれト―〉",
          {
            type: "thirdLevelDefinition",
            content: ["交尾する。 "],
            heading: "(Ａ)",
          },
          {
            type: "thirdLevelDefinition",
            content: ["性的な関係を持つ。"],
            heading: "(Ｂ)",
          },
        ],
        heading: "[二]",
      },
    ]);
  });
});
