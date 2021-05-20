export default function externalLinksAsNewTabs() {
  document
    .querySelectorAll(".external-search a.external")
    .forEach((a) => (a.target = "_blank"));
}

window.addEventListener("DOMNodeInserted", externalLinksAsNewTabs);
console.log("Loaded externalLinksAsNewTabs.js");
