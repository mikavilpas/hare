import head from "lodash/head";
import last from "lodash/last";
import TinyGesture from "tinygesture";

// the implementations are pretty simple but they work (so why change them :))
function dictContext() {
  const dicts = Array.from(document.querySelectorAll("#dictionary-list .dict"));
  const currentIndex = dicts.findIndex((d) => d.classList.contains("selected"));

  const hasResult = (d) => d.classList.contains("has-search-result");
  const before = dicts.filter((d, i) => i < currentIndex && hasResult(d));
  const after = dicts.filter((d, i) => i > currentIndex && hasResult(d));

  return { previous: last(before), next: head(after) };
}

function previousDict() {
  const { previous } = dictContext();
  previous?.click();
}

function nextDict() {
  const { next } = dictContext();
  next?.click();
}

export function registerGestures(target) {
  const gesture = new TinyGesture(target);
  gesture.on("swiperight", previousDict);
  gesture.on("swipeleft", nextDict);

  return function unregister() {
    gesture.destroy();
  };
}
