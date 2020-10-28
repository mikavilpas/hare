import { words } from "./frequency/frequency";

function replaceWithExactLink(wordDiv) {
  // point to e.g.
  // https://sakura-paris.org/dict/広辞苑/exact/自動運動
  const text = wordDiv.querySelector(".word-title-text").textContent;
  const word = words(text)[0];

  const currentPage = location.href;
  const exact = currentPage.replace(/content.*/, `exact/${word}`);
  wordDiv.querySelector(".word-permalink").href = exact;
}

function fixLinks() {
  page.wordDefinitionDivs().forEach((w) => replaceWithExactLink(w));
}

window.addEventListener("DOMNodeInserted", fixLinks);
window.addEventListener("load", fixLinks);
