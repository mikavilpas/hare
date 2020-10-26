import TinyGesture from "tinygesture";

const target = document.body;
const gesture = new TinyGesture(target);
window.gesture = gesture;

function dictNames() {
  return Array.from(document.querySelectorAll("div.dict")).map(
    (d) => d.innerText
  );
}

function currentDict() {
  return document.querySelector("div.dict > a.active");
}

function previousDict() {
  const cur = dictNames().findIndex((d) => d == currentDict().text);
  const target = Math.max(1, cur);
  const link = document.querySelector(
    `fieldset.dicts div.dict:nth-child(${target}) a`
  );
  link.click();
}

function nextDict() {
  const cur = dictNames().findIndex((d) => d == currentDict().text);
  const target = Math.max(1, cur + 2);
  const link = document.querySelector(
    `fieldset.dicts div.dict:nth-child(${target}) a`
  );
  link.click();
}

gesture.on("swiperight", previousDict);
gesture.on("swipeleft", nextDict);

console.log("Loaded swiping");
