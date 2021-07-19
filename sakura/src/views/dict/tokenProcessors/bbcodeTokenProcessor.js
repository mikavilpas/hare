import { tokenize as tokenizeBbcode } from "../../../utils/bbcode";

export default class BbcodeTokenProcessor {
  constructor(options = {}) {
    this.options = options;
  }

  convertInputText(text) {
    let parseResult;
    try {
      parseResult = tokenizeBbcode(text);
      return parseResult.value.map((t) => this.convertToken(t)).join("");
    } catch (e) {
      // fallback in case the format changes - the user must see something
      console.warn("Unable to htmlize bbcode", { text, e, parseResult });
      return text;
    }
  }

  convertToken(t) {
    if (typeof t === "string") {
      return t;
    }

    // recurse
    const content = t.content.map((c) => this.convertToken(c)).join("");

    if (t.type === "keyword") return this.convertKeyword(t, content);
    if (t.type === "subscript") return this.convertSubscript(t, content);
    if (t.type === "superscript") return this.convertSuperscript(t, content);
    if (t.type === "decoration") return this.convertDecoration(t, content);
    if (t.type === "emphasis") return this.convertEmphasis(t, content);

    // TODO render <a>
    if (t.type === "reference") return this.convertReference(t, content);
    if (t.type === "image") return this.convertImage(t, content);

    return t?.content || t; // unknown tags or no tags at all
  }

  convertString(t, content) {
    return t;
  }

  convertKeyword(t, content) {
    return `<mark>${content}</mark>`;
  }

  convertSubscript(t, content) {
    return `<sub>${content}</sub>`;
  }

  convertSuperscript(t, content) {
    return `<sup>${content}</sup>`;
  }

  convertDecoration(t, content) {
    return `<b>${content}</b>`;
  }

  convertEmphasis(t, content) {
    return `<em>${content}</em>`;
  }

  convertReference(t, content) {
    return content;
  }

  convertImage(t, content) {
    if (this.options.renderComplexTags) {
      // hyperlinks with % symbols get mangled by the text analysis phase, breaking the html
      const src = `/dict/?api=1&binary=${t.format}&dict=${this.options.dict}&offset=${t.offset}&page=${t.page}`;
      return `<img title="${t.content}" src="${src}" />`;
    } else {
      // return the tag unchanged so it can be converted to html after the
      // text analysis is complete
      return t.asText;
    }
  }
}
