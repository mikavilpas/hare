/* eslint-disable jest/valid-expect */

import { assertParses } from "../parseUtils";
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
        type: "firstLevelDefinition",
        content: [
          "ともに事をする人。同じ仕事をする人。また、その集り。同類。伴侶。たぐい。",
          {
            type: "linebreak",
          },
        ],
        heading: "(1)",
      },
      {
        type: "firstLevelDefinition",
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
