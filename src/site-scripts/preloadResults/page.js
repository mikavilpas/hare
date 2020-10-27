// provides a high level interface to the elements on the page

export function dictElement(dictName) {
  return document.querySelector(`div.dict[title="${dictName}"]`);
}

export function dictDivs() {
  return document.querySelectorAll("div.dict");
}

export function dictLinks() {
  return document.querySelectorAll("div.dict a");
}
