import "core-js/stable";
import "regenerator-runtime/runtime";

import "highlight.js/styles/github.css";
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import * as Mustache from "mustache";

async function loadFileText(path) {
  const file = await fetch(path);
  return file.text();
}

async function devCssImportCommand() {
  const source = await loadFileText("darkTheme.css");
  const template = document.getElementById("css-import-template").innerHTML;

  return Mustache.render(template, { code: JSON.stringify(source) });
}

async function devJsImportCommand() {
  const source = await loadFileText("externalLinksAsNewTabs.js");
  const template = document.getElementById("js-import-template").innerHTML;

  return Mustache.render(template, { code: JSON.stringify(source) });
}

// display
window.onload = async () => {
  var css = document.getElementById("css-import");
  css.innerHTML = await devCssImportCommand();
  hljs.highlightBlock(css);

  var js = document.getElementById("js-import");
  js.innerHTML = await devJsImportCommand();
  hljs.highlightBlock(js);
};
