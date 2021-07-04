/* eslint-disable jest/valid-expect */

import { assertParses } from "../parseUtils";
import { tokenize } from "./daijirin";

describe("top level definition parsing", () => {
  it("definition with some text after it", () => {
    const text =
      "（１）ある物事を一緒になってする者。「―に入る」「―を裏切る」「遊び―」";
    assertParses(tokenize(text), [
      {
        type: "firstLevelDefinition",
        content: [
          "ある物事を一緒になってする者。「―に入る」「―を裏切る」「遊び―」",
        ],
        heading: "（1）",
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
        type: "firstLevelDefinition",
        content: [
          "ある物事を一緒になってする者。「―に入る」「―を裏切る」「遊び―」",
          {
            type: "linebreak",
          },
        ],
        heading: "（1）",
      },
      {
        type: "firstLevelDefinition",
        content: [
          "同じ種類に属するもの。同類。「鯨は哺乳類の―であって，魚の―ではない」",
          {
            type: "linebreak",
          },
        ],
        heading: "（2）",
      },
      {
        type: "firstLevelDefinition",
        content: [
          "近世，商工業者が結成した同業組合。",
          {
            type: "linebreak",
          },
        ],
        heading: "（3）",
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
      "一緒に勉強したり仕事をしたり遊んだりして，親しく交わる人。友人。友。朋友(ホウユウ)。「―になる」「遊び―」「女―」",
      {
        type: "linebreak",
      },
    ]);
  });
});
