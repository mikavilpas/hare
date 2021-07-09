/* eslint-disable jest/valid-expect */

import { many } from "parjs/combinators";
import { assertParses } from "../parseUtils";
import { definitionChar, tokenize } from "./shinmeikai";

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
              "[表記]「懸ける・《係ける」とも書く。「橋をかける」 「はしごをかける」は、「架ける」とも書く。",
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
});
