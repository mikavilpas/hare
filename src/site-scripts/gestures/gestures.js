import TinyGesture from "tinygesture";
import * as page from "../utils/page";

const target = document.body;
const gesture = new TinyGesture(target);
window.gesture = gesture;

function currentDictIndex() {
  const dictNames = page.dictLinks().map((d) => d.text);
  return dictNames.findIndex((dname) => dname == page.currentDict().text);
}

function previousDict() {
  const target = currentDictIndex() - 1;
  const link = page.dictLinks()[target];
  link?.click();
}

function nextDict() {
  const target = currentDictIndex() + 1;
  const link = page.dictLinks()[target];
  link?.click();
}

gesture.on("swiperight", previousDict);
gesture.on("swipeleft", nextDict);

console.log("Loaded swiping");
