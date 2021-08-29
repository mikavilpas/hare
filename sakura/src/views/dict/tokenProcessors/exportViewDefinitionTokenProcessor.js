import DefinitionTokenProcessor from "./definitionTokenProcessor";

export default class ExportViewDefinitionTokenProcessor extends DefinitionTokenProcessor {
  constructor(options) {
    super(options);
  }

  convertExampleSentence(t) {
    // render an extra element to mount quote actions into using react
    const content = super.convertToken(t.content);
    return `<span class="quote border border-dark rounded mr-3">
              ${content}
              <span class="quote-actions" data-quote="${t.innerQuote}"></span>
            </span>`;
  }
}
