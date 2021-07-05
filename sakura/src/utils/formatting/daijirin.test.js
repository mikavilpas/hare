/* eslint-disable jest/valid-expect */

import { assertParses } from "../parseUtils";
import { tokenize } from "./daijirin";

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
        type: "firstLevelDefinition",
        content: [],
        heading: "（1）",
      },
    ]);
  });
});

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

  it("definition in another format", () => {
    const text = `し-まつ [1] 【始末】 （名）スル （１）（物事の）しめくくりを付けること。片付けること。処理。「―を付ける」「このごたごたをどう―するつもりだ」 （２）無駄遣いしないこと。倹約すること。「なんでも―して使う人」「藤屋の市兵衛が申事を尤と思はば，―をすべし/浮世草子・一代男 7」 （３）結果。主として悪い状態についていう。「さんざん迷惑をかけたあげく，あの―だ」 （４）物事の事情。事の次第。「私が此書(ホン)を読む様になりました―は/不如帰（蘆花）」`;
    assertParses(tokenize(text), [
      "し-まつ [1] 【始末】 （名）スル ",
      {
        type: "firstLevelDefinition",
        content: [
          "（物事の）しめくくりを付けること。片付けること。処理。「―を付ける」「このごたごたをどう―するつもりだ」 ",
        ],
        heading: "（1）",
      },
      {
        type: "firstLevelDefinition",
        content: [
          "無駄遣いしないこと。倹約すること。「なんでも―して使う人」「藤屋の市兵衛が申事を尤と思はば，―をすべし/浮世草子・一代男 7」 ",
        ],
        heading: "（2）",
      },
      {
        type: "firstLevelDefinition",
        content: [
          "結果。主として悪い状態についていう。「さんざん迷惑をかけたあげく，あの―だ」 ",
        ],
        heading: "（3）",
      },
      {
        type: "firstLevelDefinition",
        content: [
          "物事の事情。事の次第。「私が此書(ホン)を読む様になりました―は/不如帰（蘆花）」",
        ],
        heading: "（4）",
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
