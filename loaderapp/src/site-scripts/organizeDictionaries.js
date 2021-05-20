import * as page from "./utils/page";

function removeWeirdDictionaries() {
  page.dictDivs().forEach((d) => {
    if (!page.myDictionaries.includes(d.title)) {
      d.classList.add("dict-hidden");
    }
  });
}

window.addEventListener("load", removeWeirdDictionaries);
window.addEventListener("DOMNodeInserted", removeWeirdDictionaries);
console.log("Enabled preloading of results for selected dicts.");
