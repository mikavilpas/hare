import "core-js/stable";
import "regenerator-runtime/runtime";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

async function loadFileText(path) {
  const file = await fetch(path);
  return file.text();
}

async function devCssImportCommand() {
  const text = await loadFileText("darkTheme.css");
  return `
      window.__STORE__.dispatch(window.__ACTIONS__.updateUserConfig({
        css: "${text}"
      }));`;
}

async function devJsImportCommand() {
  const text = await loadFileText("externalLinksAsNewTabs.js");

  return `
      window.__STORE__.dispatch(window.__ACTIONS__.updateUserConfig({
        js: "${text}"
      }));`;
}

// display
window.onload = async () => {
  var css = document.getElementById("css-import");
  css.innerHTML = await devCssImportCommand();

  var js = document.getElementById("js-import");
  js.innerHTML = await devJsImportCommand();
};
