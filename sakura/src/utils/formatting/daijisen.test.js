/* eslint-disable jest/valid-expect */

import { assertFailsParsing, assertParses } from "../parseUtils";
import { definitionChar, tokenize } from "./daijisen";

describe("top level definition parsing", () => {
  it("definition with some text after it", () => {
    const text = "[一]［名］";
    assertParses(tokenize(text), [
      {
        type: "firstLevelDefinition",
        heading: "[一]",
        content: ["［名］"],
      },
    ]);
  });

  it("definition character parsing", () => {
    // can read a character
    assertParses(definitionChar.parse("［"), "［");

    // fails when trying to read definitions
    assertFailsParsing(definitionChar.parse("[一]［名］"), "［");
    assertFailsParsing(
      definitionChar.parse(
        "(1)細長い物の一本。一条。「―の髪の毛」「―伝わる涙」"
      )
    );
  });

  it("definition with a second level definition", () => {
    const text =
      "[一]［名］(1)細長い物の一本。一条。「―の髪の毛」「―伝わる涙」";
    assertParses(tokenize(text), [
      {
        type: "firstLevelDefinition",
        heading: "[一]",
        content: [
          "［名］",
          {
            type: "secondLevelDefinition",
            number: 1,
            content: ["細長い物の一本。一条。「―の髪の毛」「―伝わる涙」"],
            heading: "(1)",
          },
        ],
      },
    ]);
  });

  it("definition with two second level definitions", () => {
    const text =
      "[一]［名］(1)細長い物の一本。一条。「―の髪の毛」「―伝わる涙」(2)一門。一族。「多くはただこの九条殿の御―なり」〈大鏡・師輔〉";
    assertParses(tokenize(text), [
      {
        type: "firstLevelDefinition",
        heading: "[一]",
        content: [
          "［名］",
          {
            type: "secondLevelDefinition",
            number: 1,
            content: ["細長い物の一本。一条。「―の髪の毛」「―伝わる涙」"],
            heading: "(1)",
          },
          {
            type: "secondLevelDefinition",
            number: 2,
            content: [
              "一門。一族。「多くはただこの九条殿の御―なり」〈大鏡・師輔〉",
            ],
            heading: "(2)",
          },
        ],
      },
    ]);
  });

  it("can parse a second top level definition", () => {
    const text = `[二]［形動］[文]［ナリ］(1)ただ一つのことに心を傾けるさま。「芸―に生きる」
(2)普通の程度であるさま。ひとかた。並大抵。「鵜舟さす夜河のた縄うちはへて―ならずものぞ悲しき」〈新千載・雑上〉`;
    assertParses(tokenize(text), [
      {
        type: "firstLevelDefinition",
        heading: "[二]",
        content: [
          "［形動］[文]［ナリ］",
          {
            type: "secondLevelDefinition",
            number: 1,
            content: [
              "ただ一つのことに心を傾けるさま。「芸―に生きる」",
              { type: "linebreak" },
            ],
            heading: "(1)",
          },
          {
            type: "secondLevelDefinition",
            number: 2,
            content: [
              "普通の程度であるさま。ひとかた。並大抵。「鵜舟さす夜河のた縄うちはへて―ならずものぞ悲しき」〈新千載・雑上〉",
            ],
            heading: "(2)",
          },
        ],
      },
    ]);
  });
});

describe("second level definition parsing", () => {
  it("can parse definitions with two digits", () => {
    // http://localhost:4000/#/dict/%E5%A4%A7%E8%BE%9E%E6%B3%89/prefix/%E3%81%8B%E3%81%91%E3%82%8B/2
    const text =
      "(10)ある働き・作用を仕向ける。また、こちらの気持ちなどを相手へ向ける。 ";
    assertParses(tokenize(text), [
      {
        type: "secondLevelDefinition",
        number: 10,
        content: [
          "ある働き・作用を仕向ける。また、こちらの気持ちなどを相手へ向ける。 ",
        ],
        heading: "(10)",
      },
    ]);
  });
});

describe("third level definition parsing", () => {
  it("can parse all third level definitions", () => {
    // http://localhost:4000/#/dict/%E5%A4%A7%E8%BE%9E%E6%B3%89/prefix/%E3%81%8B%E3%81%91%E3%82%8B/2
    const text = `(10)㋐ある働き・作用を仕向ける。また、こちらの気持ちなどを相手へ向ける。 「催眠術を―・ける」 「暗示に―・ける」 「なぞを―・ける」 「情けを―・ける」 ㋑送って相手に届かせる。 「電話を―・ける」 「言葉を―・ける」 ㋒取り付けてある仕掛けを働かせて、本体が動かないように固定する。 「鍵（かぎ）を―・ける」 ㋓操作を加えて機械・装置などを作動させる。 「目覚ましを―・ける」 「レコードを―・ける」 「ブレーキを―・ける」 ㋔道具を用いて他に作用を及ぼす。 「アイロンを―・ける」 「雑巾を―・けた廊下」 `;

    assertParses(tokenize(text), [
      {
        type: "secondLevelDefinition",
        number: 10,
        content: [
          {
            type: "thirdLevelDefinition",
            content: [
              "ある働き・作用を仕向ける。また、こちらの気持ちなどを相手へ向ける。 「催眠術を―・ける」 「暗示に―・ける」 「なぞを―・ける」 「情けを―・ける」 ",
            ],
            heading: "㋐",
          },
          {
            type: "thirdLevelDefinition",
            content: [
              "送って相手に届かせる。 「電話を―・ける」 「言葉を―・ける」 ",
            ],
            heading: "㋑",
          },
          {
            type: "thirdLevelDefinition",
            content: [
              "取り付けてある仕掛けを働かせて、本体が動かないように固定する。 「鍵（かぎ）を―・ける」 ",
            ],
            heading: "㋒",
          },
          {
            type: "thirdLevelDefinition",
            content: [
              "操作を加えて機械・装置などを作動させる。 「目覚ましを―・ける」 「レコードを―・ける」 「ブレーキを―・ける」 ",
            ],
            heading: "㋓",
          },
          {
            type: "thirdLevelDefinition",
            content: [
              "道具を用いて他に作用を及ぼす。 「アイロンを―・ける」 「雑巾を―・けた廊下」 ",
            ],
            heading: "㋔",
          },
        ],
        heading: "(10)",
      },
    ]);
  });
});

it("should ignore meta quotes", () => {
  const text = "(2) 《(一) (1) に似ているところから》 ";
  assertParses(tokenize(text), [
    {
      type: "secondLevelDefinition",
      number: 2,
      content: [" 《(一) (1) に似ているところから》 "],
      heading: "(2)",
    },
  ]);
});
