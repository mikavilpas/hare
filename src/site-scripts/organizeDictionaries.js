import * as page from "./utils/page";

function removeWeirdDictionaries() {
  page.dictDivs().forEach((d) => {
    if (!page.myDictionaries.includes(d.title)) {
      console.log(`removing dict ${d.title}`);
      page.allDictsFieldset().removeChild(d);
    }
  });
}

window.addEventListener("load", removeWeirdDictionaries);
window.addEventListener("DOMNodeInserted", removeWeirdDictionaries);
console.log("Enabled preloading of results for selected dicts.");
