/* eslint-disable jest/valid-expect */

import { assertFailsParsing, assertParses } from "../testUtils";
import { definitionChar, synonymSection, tokenize } from "./daijisen";

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

  it("can parse wannabe accent information", () => {
    // https://sakura-paris.org/dict/#/export/大辞泉/prefix/一段/0
    const text = `(2)文章(一)はイチダン、(二)はイチダン。`;
    assertParses(tokenize(text), [
      {
        type: "secondLevelDefinition",
        number: 2,
        content: ["文章(一)はイチダン、(二)はイチダン。"],
        heading: "(2)",
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

describe("synonym section", () => {
  it("can parse a synonym section", () => {
    const text = `［類語］[subscript]（(1)）[/subscript]（「―と」「―たる」の形で）隆隆[subscript]（りゆうりゆう）[/subscript]・鬱然[subscript]（うつぜん）[/subscript]・澎湃[subscript]（ほうはい）[/subscript]・勃勃[subscript]（ぼつぼつ）[/subscript]・油然[subscript]（ゆうぜん）[/subscript]・湧然[subscript]（ゆうぜん）[/subscript]・沸沸[subscript]（ふつふつ）[/subscript]／[subscript]（(2)）[/subscript]旺盛[subscript]（おうせい）[/subscript]・軒昂[subscript]（けんこう）[/subscript]／[subscript]（(3)）[/subscript]盛大・隆盛・殷盛[subscript]（いんせい）[/subscript]・殷賑[subscript]（いんしん）[/subscript]・全盛／[subscript]（(4)）[/subscript]大いに・頻[subscript]（しき）[/subscript]りに・繁[subscript]（しげ）[/subscript]く・頻繁[subscript]（ひんぱん）[/subscript]に・引っ切りなしに・絶えず
`;

    assertParses(synonymSection().parse(text), {
      type: "synonymSection",
      content: [
        "［類語］",
        {
          type: "firstLevelDefinition",
          content: [
            "（「―と」「―たる」の形で）隆隆[subscript]（りゆうりゆう）[/subscript]",
            "鬱然[subscript]（うつぜん）[/subscript]",
            "澎湃[subscript]（ほうはい）[/subscript]",
            "勃勃[subscript]（ぼつぼつ）[/subscript]",
            "油然[subscript]（ゆうぜん）[/subscript]",
            "湧然[subscript]（ゆうぜん）[/subscript]",
            "沸沸[subscript]（ふつふつ）[/subscript]",
          ],
          heading: "(1)",
        },
        {
          type: "firstLevelDefinition",
          content: [
            "旺盛[subscript]（おうせい）[/subscript]",
            "軒昂[subscript]（けんこう）[/subscript]",
          ],
          heading: "(2)",
        },
        {
          type: "firstLevelDefinition",
          content: [
            "盛大",
            "隆盛",
            "殷盛[subscript]（いんせい）[/subscript]",
            "殷賑[subscript]（いんしん）[/subscript]",
            "全盛",
          ],
          heading: "(3)",
        },
        {
          type: "firstLevelDefinition",
          content: [
            "大いに",
            "頻[subscript]（しき）[/subscript]りに",
            "繁[subscript]（しげ）[/subscript]く",
            "頻繁[subscript]（ひんぱん）[/subscript]に",
            "引っ切りなしに",
            "絶えず\n",
          ],
          heading: "(4)",
        },
      ],
    });
  });

  it("can parse one at the end of a definition", () => {
    const text = `
(4)
積極的に繰り返し行われるさま。熱心。「学者の間で―な議論が交わされた」
［類語］[subscript]（(1)）[/subscript]（「―と」「―たる」の形で）隆隆[subscript]（りゆうりゆう）[/subscript]・鬱然[subscript]（うつぜん）[/subscript]
`;
    assertParses(tokenize(text), [
      {
        type: "linebreak",
      },
      {
        type: "secondLevelDefinition",
        number: 4,
        content: [
          {
            type: "linebreak",
          },
          "積極的に繰り返し行われるさま。熱心。「学者の間で―な議論が交わされた」",
          {
            type: "linebreak",
          },
        ],
        heading: "(4)",
      },
      {
        type: "synonymSection",
        content: [
          "［類語］",
          {
            type: "firstLevelDefinition",
            content: [
              "（「―と」「―たる」の形で）隆隆[subscript]（りゆうりゆう）[/subscript]",
              "鬱然[subscript]（うつぜん）[/subscript]\n",
            ],
            heading: "(1)",
          },
        ],
      },
    ]);
  });

  it("can parse a synonym section with bbcode tags", () => {
    const text = `［類語］[subscript]（(1)）[/subscript]（「―と」「―たる」の形で）隆隆[subscript]（りゆうりゆう）[/subscript]`;
    assertParses(tokenize(text), [
      {
        type: "synonymSection",
        content: [
          "［類語］",
          {
            type: "firstLevelDefinition",
            content: [
              "（「―と」「―たる」の形で）隆隆[subscript]（りゆうりゆう）[/subscript]",
            ],
            heading: "(1)",
          },
        ],
      },
    ]);
  });

  it("can parse a reference heading", () => {
    const text = `［類語］(二)満足・十全・十二分／{{zc370}}[subscript]（(1)）[/subscript]存分に・思うさま・良く・みっちり・みっしり・篤[subscript]（とく）[/subscript]と・万万[subscript]（ばんばん）[/subscript]／[subscript]（(2)）[/subscript]たっぷり・優[subscript]（ゆう）[/subscript]に
`;
    assertParses(synonymSection().parse(text), {
      type: "synonymSection",
      content: [
        "［類語］",
        {
          type: "firstLevelDefinition",
          content: ["満足", "十全", "十二分"],
          heading: "(二)",
        },
        {
          type: "firstLevelDefinition",
          content: [
            "存分に",
            "思うさま",
            "良く",
            "みっちり",
            "みっしり",
            "篤[subscript]（とく）[/subscript]と",
            "万万[subscript]（ばんばん）[/subscript]",
          ],
          heading: "(1)",
        },
        {
          type: "firstLevelDefinition",
          content: ["たっぷり", "優[subscript]（ゆう）[/subscript]に\n"],
          heading: "(2)",
        },
      ],
    });
  });
});

describe("clitic section", () => {
  it("can tokenize one", () => {
    const text = `(1)物
［下接語］足音・雨[subscript]（あま）[/subscript]音・風[subscript]（かざ）[/subscript]音・楫[subscript]（かじ）[/subscript]音・川音・靴音・瀬音・槌[subscript]（つち）[/subscript]音・筒音・爪[subscript]（つま）[/subscript]音・弦[subscript]（つる）[/subscript]音・波音・刃音・羽[subscript]（は）[/subscript]音・葉音・歯音・撥[subscript]（ばち）[/subscript]音・水音・物音・矢音
`;
    assertParses(tokenize(text), [
      {
        type: "secondLevelDefinition",
        number: 1,
        content: [
          "物",
          {
            type: "linebreak",
          },
        ],
        heading: "(1)",
      },
      {
        type: "cliticSection",
        heading: "［下接語］",
        content: [
          "足音",
          "雨[subscript]（あま）[/subscript]音",
          "風[subscript]（かざ）[/subscript]音",
          "楫[subscript]（かじ）[/subscript]音",
          "川音",
          "靴音",
          "瀬音",
          "槌[subscript]（つち）[/subscript]音",
          "筒音",
          "爪[subscript]（つま）[/subscript]音",
          "弦[subscript]（つる）[/subscript]音",
          "波音",
          "刃音",
          "羽[subscript]（は）[/subscript]音",
          "葉音",
          "歯音",
          "撥[subscript]（ばち）[/subscript]音",
          "水音",
          "物音",
          "矢音\n",
        ],
      },
    ]);
  });
});
