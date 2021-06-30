/* eslint-disable jest/valid-expect */

import * as formatting from "./formatting";

describe("quote parsing", () => {
  it("can parse a quote", () => {
    assertParses("「あなた―に話す」", [
      {
        type: "quote",
        content: "あなた―に話す",
      },
    ]);
  });

  it("can parse two quotes", () => {
    assertParses("「あなた―に話す」「二人―で話したい」", [
      {
        type: "quote",
        content: "あなた―に話す",
      },
      {
        type: "quote",
        content: "二人―で話したい",
      },
    ]);
  });

  it("can parse text", () => {
    const input = "（１）それに限定する意を表す。";
    assertParses(input, [input]);
  });

  it("can parse mixed definition text and quotes", () => {
    assertParses(
      "（１）それに限定する意を表す。「あなた―に話す」「二人―で話したい」「ちょっと庭へ出る―だ」「形式―整ってもだめだ」 ",
      [
        "（１）それに限定する意を表す。",
        {
          type: "quote",
          content: "あなた―に話す",
        },
        {
          type: "quote",
          content: "二人―で話したい",
        },
        {
          type: "quote",
          content: "ちょっと庭へ出る―だ",
        },
        {
          type: "quote",
          content: "形式―整ってもだめだ",
        },
        " ",
      ]
    );
  });
});

function assertParses(input, result) {
  const parseResult = formatting.tokenize(input);
  if (parseResult.kind !== "OK") {
    console.log(parseResult.trace);
  }

  expect(parseResult).to.deep.eql({ kind: "OK", value: result });
}
