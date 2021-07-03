/* eslint-disable jest/valid-expect */

import * as bbcode from "./bbcode";

describe("tokenizing", () => {
  it("can tokenize a tag followed by some text", () => {
    // case with tag and a non-tag (not a recognized bbcode tag, just text in
    // the same format)
    expect(
      bbcode.tokenize(
        "[keyword]めぐらす【巡らす】[/keyword]\n[囲む]surround[enclose]<the house with trees>;"
      )
    ).to.eql({
      value: [
        {
          type: "keyword",
          content: ["めぐらす【巡らす】"],
        },
        "\n[囲む]surround[enclose]<the house with trees>;",
      ],
      kind: "OK",
    });
  });

  it("can tokenize [subscript]", () => {
    expect(bbcode.tokenize("[subscript]‥ヱン[/subscript]")).to.eql({
      value: [
        {
          type: "subscript",
          content: ["‥ヱン"],
        },
      ],
      kind: "OK",
    });
  });

  it("can tokenize [superscript]", () => {
    expect(bbcode.tokenize("[superscript]（→）[/superscript]")).to.eql({
      value: [
        {
          type: "superscript",
          content: ["（→）"],
        },
      ],
      kind: "OK",
    });
  });

  it("can tokenize [decoration]", () => {
    expect(bbcode.tokenize("万葉集[decoration]5[/decoration]")).to.eql({
      value: [
        "万葉集",
        {
          type: "decoration",
          content: ["5"],
        },
      ],
      kind: "OK",
    });
  });

  it("can tokenize [emphasis]", () => {
    expect(bbcode.tokenize("[emphasis]万葉集[/emphasis]")).to.eql({
      value: [
        {
          type: "emphasis",
          content: ["万葉集"],
        },
      ],
      kind: "OK",
    });
  });

  it("can tokenize [reference]", () => {
    expect(
      bbcode.tokenize(
        "[reference]⇒犬が西向きゃ尾は東[/reference page=1355,offset=432]"
      )
    ).to.eql({
      value: [
        {
          type: "reference",
          page: "1355",
          offset: "432",
          content: ["⇒犬が西向きゃ尾は東"],
        },
      ],
      kind: "OK",
    });
  });

  it("can read key value pairs", () => {
    expect(bbcode.propertyKeyValue.parse("key=value")).to.eql({
      value: { key: "value" },
      kind: "OK",
    });
  });

  it("can read key value pair lists", () => {
    expect(bbcode.propertyKeyValueListing.parse("key=value")).to.deep.eql({
      value: { key: "value" },
      kind: "OK",
    });

    expect(
      bbcode.propertyKeyValueListing.parse("key=value,another=hello,third=hi")
    ).to.eql({
      value: { key: "value", another: "hello", third: "hi" },
      kind: "OK",
    });
  });

  it("can tokenize [image]", () => {
    expect(
      bbcode.tokenize(
        "foo[image format=jpg,inline=0,page=83438,offset=928]筆順[/image]stuff"
      )
    ).to.deep.eql({
      value: [
        "foo",
        {
          type: "image",
          format: "jpg",
          inline: "0",
          page: "83438",
          offset: "928",
          content: ["筆順"],
          asText:
            "[image format=jpg,inline=0,page=83438,offset=928]筆順[/image]",
        },
        "stuff",
      ],
      kind: "OK",
    });
  });

  it("supports tag like text", () => {
    expect(
      bbcode.tokenize("[superscript]hello [not a tag], friend[/superscript]")
    ).to.eql({
      value: [
        {
          type: "superscript",
          content: ["hello [not a tag], friend"],
        },
      ],
      kind: "OK",
    });
  });

  it("supports nested tags within nestable tags", () => {
    expect(
      bbcode.tokenize("[superscript][emphasis]hello[/emphasis][/superscript]")
    ).to.eql({
      value: [
        {
          type: "superscript",
          content: [
            {
              type: "emphasis",
              content: ["hello"],
            },
          ],
        },
      ],
      kind: "OK",
    });
  });

  it("supports nesting the same tag", () => {
    // doesn't really make any sense in html though
    expect(
      bbcode.tokenize(
        "[superscript][superscript]hello[/superscript][/superscript]"
      )
    ).to.eql({
      value: [
        {
          type: "superscript",
          content: [
            {
              type: "superscript",
              content: ["hello"],
            },
          ],
        },
      ],
      kind: "OK",
    });
  });

  it("supports nested tags within complex tags", () => {
    expect(
      bbcode.tokenize(
        "[reference][superscript]（→）[/superscript]「いぬかき」[/reference page=1355,offset=320]に同じ。"
      )
    ).to.eql({
      value: [
        {
          type: "reference",
          content: [
            {
              type: "superscript",
              content: ["（→）"],
            },
            "「いぬかき」",
          ],
          page: "1355",
          offset: "320",
        },
        "に同じ。",
      ],
      kind: "OK",
    });
  });

  it("supports nestable tags containing complex tags", () => {
    expect(
      bbcode.tokenize(
        "[emphasis][reference]（→）「いぬかき」[/reference page=1355,offset=320][/emphasis]に同じ。"
      )
    ).to.eql({
      value: [
        {
          type: "emphasis",
          content: [
            {
              type: "reference",
              content: ["（→）「いぬかき」"],
              page: "1355",
              offset: "320",
            },
          ],
        },
        "に同じ。",
      ],
      kind: "OK",
    });
  });

  it("returns unknown tags without any changes", () => {
    expect(
      bbcode.tokenize("[japanese-is-cool]contents here[/japanese-is-cool]")
    ).to.eql({
      value: ["[japanese-is-cool]contents here[/japanese-is-cool]"],
      kind: "OK",
    });
  });
});
