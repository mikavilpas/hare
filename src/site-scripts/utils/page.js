// provides a high level interface to the elements on the page

export function allDictsFieldset() {
  return document.querySelector("fieldset.dicts");
}

export function dictElement(dictName) {
  return document.querySelector(`div.dict[title="${dictName}"]`);
}

export function dictDivs() {
  const divs = document.querySelectorAll("div.dict");
  return Array.from(divs);
}

export function dictLinks() {
  return document.querySelectorAll("div.dict a");
}

export const myDictionaries = [
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
