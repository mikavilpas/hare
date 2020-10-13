import "core-js/stable";
import "regenerator-runtime/runtime";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

async function devCssImportCommand() {
  const darkTheme = await fetch("darkTheme.css");
  const text = await darkTheme.text();
  return `
      window.__STORE__.dispatch(window.__ACTIONS__.updateUserConfig({
        css: "${text}",
        js: ""
      }));`;
}

// display
window.onload = async () => {
  var css = document.getElementById("css-import");
  css.innerHTML = await devCssImportCommand();
};
