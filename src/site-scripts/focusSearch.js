import * as page from "./utils/page";

function focusSearch() {
  page.titleLink().addEventListener("click", () => {
    page.searchBox().focus();
  });
}

window.addEventListener("load", () => {
  focusSearch();
});
focusSearch();
