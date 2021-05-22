import { loadCss, loadJs, base } from "./utils";

// This file is loaded by the loader loader. It specifies the necessary scripts
// to add in order to get the app running in the host site.

function load() {
  loadCss(
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"
  )
    .then(() => loadCss(`${base}/static/css/main.css`))
    .then(() => loadJs(`${base}/static/js/main.js`));
}

// legacy support
function loadOldUi() {
  loadJs(`${base}/prod.js`).then(() => loadCss(`${base}/prod.css`));
}

if (window) {
  window.load = load;
  window.loadOldUi = loadOldUi;
}
