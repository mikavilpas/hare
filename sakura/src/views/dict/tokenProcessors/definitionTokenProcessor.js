export default class DefinitionTokenProcessor {
  constructor(options) {
    this.options = options;

    // allow recursion in the class scope
    this.convertToken = this.convertToken.bind(this);
  }

  convertInputText(text) {
    let parseResult; // helps debugging
    try {
      parseResult = this.options.formatFunction(text);
      const result = parseResult.value
        .map((t) => this.convertToken(t))
        .join("");
      return result;
    } catch (e) {
      console.warn("Unable to format dictionary definition text", {
        text,
        e,
        parseResult,
      });
      return text;
    }
  }

  convertToken(t) {
    if (typeof t === "string") {
      return t;
    } else if (t.type === "linebreak") {
      return this.convertLinebreak(t);
    } else if (t.type === "exampleSentence") {
      return this.convertExampleSentence(t);
    } else if (t.type === "synonymSection") {
      return this.convertSynonymSection(t);
    } else if (t.type === "cliticSection") {
      return this.convertCliticSection(t);
    } else if (t.type === "exampleSentenceGroup") {
      return this.convertExampleSentenceGroup(t);
    } else {
      return this.convertDefinitionSection(t);
    }
  }

  convertLinebreak(t) {
    return "<br />";
  }

  convertExampleSentence(t) {
    return `<span class="quote border border-dark rounded mr-3">
              ${t.content}
            </span>`;
  }

  convertSynonymSection(t) {
    // these are regular definitions for now
    const synonymDefinitions = t.content.map(this.convertToken).join("");
    return `<div class="synonym-section mt-3"><div class="content">${synonymDefinitions}</div></div>`;
  }

  convertCliticSection(t) {
    const content = t.content
      .map(
        (t) =>
          `<span class="quote word border border-dark rounded mr-4">${t}</span>`
      )
      .join("");
    return `<div class="synonym-section mt-3"><span class="heading">${t.heading}</span> <div class="content">${content}</div></div>`;
  }

  convertExampleSentenceGroup(t) {
    const sentences = t.content.map((t) => this.convertToken(t)).join("");
    return `<div class="example-sentence-group rounded">${sentences}</div>`;
  }

  convertDefinitionSection(t) {
    const content = t.content.map(this.convertToken).join("");
    let level = 0;
    switch (t.type) {
      case "firstLevelDefinition":
        level = 1;
        break;
      case "secondLevelDefinition":
        level = 2;
        break;
      case "thirdLevelDefinition":
        level = 3;
        break;
      case "fourthLevelDefinition":
        level = 4;
        break;
      default:
        console.warn("Unexpected token", t);
        return t;
    }
    return `<div class="definition-section level-${level}">
              <span class="heading">${t.heading}</span>
              <div class="content">${content}</div>
            </div>`;
  }
}
