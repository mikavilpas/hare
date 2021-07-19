/* eslint-disable jest/valid-expect */

import { assertParses } from "../testUtils";
import { tokenize } from "./koujien";

describe("top level definition parsing", () => {
  it("many definitions", () => {
    const text = `なか‐ま【仲間】
①ともに事をする人。同じ仕事をする人。また、その集り。同類。伴侶。たぐい。
②近世における商工業者の独占的な同業組合。株仲間。
⇒なかま‐いしき【仲間意識】
⇒なかま‐いり【仲間入り】
`;
    assertParses(tokenize(text), [
      "なか‐ま【仲間】",
      {
        type: "linebreak",
      },
      {
        type: "secondLevelDefinition",
        number: 1,
        content: [
          "ともに事をする人。同じ仕事をする人。また、その集り。同類。伴侶。たぐい。",
          {
            type: "linebreak",
          },
        ],
        heading: "(1)",
      },
      {
        type: "secondLevelDefinition",
        number: 2,
        content: [
          "近世における商工業者の独占的な同業組合。株仲間。",
          {
            type: "linebreak",
          },
          "⇒なかま‐いしき【仲間意識】",
          {
            type: "linebreak",
          },
          "⇒なかま‐いり【仲間入り】",
          {
            type: "linebreak",
          },
        ],
        heading: "(2)",
      },
    ]);
  });

  it("can parse one when marked with a circled number", () => {
    const text = `➋事物を曲がった物・とがった物・張った物・仕組んだ物などでとらえる。 `;
    assertParses(tokenize(text), [
      {
        type: "firstLevelDefinition",
        content: [
          "事物を曲がった物・とがった物・張った物・仕組んだ物などでとらえる。 ",
        ],
        heading: "(➋)",
      },
    ]);
  });
});

describe("second level parsing", () => {
  it("can parse two levels", () => {
    const text = `[keyword]いち‐だん[/keyword]【[keyword]一段[/keyword]】
[一]〔名〕
①階段などの一きざみ。転じて、事件の一くぎり、地位・技能の一段階など。「―の御上達」
②文章・語り物などの一くぎり。
[二]〔副〕
(「と」を伴っても用いる)一際[subscript]ひときわ[/subscript]。一層。狂言、烏帽子折「―ういやつぢや」。「―と腕があがる」
[reference]⇒いちだん‐かつよう【一段活用】[/reference page=1167,offset=712]
`;
    assertParses(tokenize(text), [
      "[keyword]いち‐だん[/keyword]【[keyword]一段[/keyword]】",
      {
        type: "linebreak",
      },
      {
        type: "firstLevelDefinition",
        content: [
          "〔名〕",
          {
            type: "linebreak",
          },
          {
            type: "secondLevelDefinition",
            number: 1,
            content: [
              "階段などの一きざみ。転じて、事件の一くぎり、地位・技能の一段階など。「―の御上達」",
              {
                type: "linebreak",
              },
            ],
            heading: "(1)",
          },
          {
            type: "secondLevelDefinition",
            number: 2,
            content: [
              "文章・語り物などの一くぎり。",
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
        type: "firstLevelDefinition",
        content: [
          "〔副〕",
          {
            type: "linebreak",
          },
          "(「と」を伴っても用いる)一際[subscript]ひときわ[/subscript]。一層。狂言、烏帽子折「―ういやつぢや」。「―と腕があがる」",
          {
            type: "linebreak",
          },
          "[reference]⇒いちだん‐かつよう【一段活用】[/reference page=1167,offset=712]",
          {
            type: "linebreak",
          },
        ],
        heading: "(二)",
      },
    ]);
  });
});

describe("content with no structure", () => {
  it("can parse a definition without a structure", () => {
    const text = `なかま‐うち【仲間内】
気心の知れた者たちの内部。「―での話題」
⇒なか‐ま【仲間】
`;
    assertParses(tokenize(text), [
      "なかま‐うち【仲間内】",
      {
        type: "linebreak",
      },
      "気心の知れた者たちの内部。「―での話題」",
      {
        type: "linebreak",
      },
      "⇒なか‐ま【仲間】",
      {
        type: "linebreak",
      },
    ]);
    //
  });
});

describe("third level parsing", () => {
  it("can parse a third level definition", () => {
    const text = `③㋐上水 ㋑特に `;
    assertParses(tokenize(text), [
      {
        type: "secondLevelDefinition",
        number: 3,
        content: [
          {
            type: "thirdLevelDefinition",
            content: ["上水 "],
            heading: "㋐",
          },
          {
            type: "thirdLevelDefinition",
            content: ["特に "],
            heading: "㋑",
          },
        ],
        heading: "(3)",
      },
    ]);
  });
});
