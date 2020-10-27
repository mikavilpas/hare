import { DefinitionCache } from "./definitionCache";
import { ChangeListener } from "./changeListener";
import { loadResult } from "./queryService";
import * as page from "./page";

let myCache = new DefinitionCache();

function queryChanged(previousState, state) {
  // TODO this is a bit broken due to how the site works
  const qChange = previousState.q != state.q;
  return qChange;
}

// only operate on the dictionaries I want to use. This is to save the server resources.
const interestingDicts = [
  "広辞苑",
  "大辞林",
  "大辞泉",
  "ハイブリッド新辞林", // "新辞林",
  "学研古語辞典", //  "古語",
  "日本国語大辞典", // "日国",
  "学研国語大辞典", // "学国",
  "明鏡国語辞典", // "明鏡",
  "新明解国語辞典", // "新明解",
  "学研漢和大字典", // "漢和",
  "英辞郎",
];

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
  const jobs = interestingDicts.map((d) =>
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
