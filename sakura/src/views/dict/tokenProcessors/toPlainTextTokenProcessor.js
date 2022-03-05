import { tokenize as tokenizeBbcode } from "../../../utils/bbcode";

// Processor that removes all formatting and just preserves the content of each
// token as text.
export default class ToPlainTextTokenProcessor {
  constructor() {}

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
    return "";

    // ignore everything else! we only want dumb text because that is machine
    // readable.
  }
}
