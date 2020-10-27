import { DefinitionCache } from "./definitionCache";
import { ChangeListener } from "./changeListener";
import { loadResult } from "./queryService";
import * as page from "../utils/page";

let myCache = new DefinitionCache();

function queryChanged(previousState, state) {
  // TODO this is a bit broken due to how the site works
  const qChange = previousState.q != state.q;
  return qChange;
}

function currentQueryWord() {
  return __STORE__.getState().q;
}

function hijackDictLinks() {
  page.dictLinks().forEach((a) =>
    a.addEventListener("click", (e) => {
      const dictName = e.path[1].title;
      const queryWord = currentQueryWord();
      const cached = myCache.get(dictName, queryWord);
      if (cached) {
        __STORE__.dispatch(__ACTIONS__.selectDict(dictName));
        __STORE__.dispatch(__ACTIONS__.search_result(cached));
        e.stopPropagation();
        e.preventDefault();
      }
    })
  );
}

function preloadResults() {
  // myCache = new DefinitionCache();

  const queryWord = currentQueryWord();
  const jobs = page.myDictionaries.map((d) =>
    loadResult(d, queryWord)
      .then((result) => myCache.store(d, queryWord, result))
      .then(() => {
        page.dictElement(d).classList.add("preloaded");
      })
  );
  return Promise.allSettled(jobs);
}

window.addEventListener("load", () => {
  const listener = new ChangeListener(__STORE__, queryChanged);
  listener.listen(async () => {
    // remove preloaded status from previous run
    page.dictDivs().forEach((div) => div.classList.remove("preloaded"));
    return await preloadResults();
  });

  preloadResults();
  hijackDictLinks();
});

console.log("Enabled preloading of results for selected dicts.");
