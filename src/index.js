import "core-js/stable";
import "regenerator-runtime/runtime";

import hljs from "highlight.js/lib/core";
import "highlight.js/styles/github.css";

import * as Mustache from "mustache";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";

import * as sourceCodeService from "./sourceCodeService.js";

require("file-loader?name=[name].[ext]!../index.html");

async function concatFiles(files) {
  const jobs = files.map(sourceCodeService.loadFileText);
  return Promise.all(jobs).then((texts) => texts.join("\n"));
}

function displaySourceFiles({
  data,
  templateText,
  codeElement,
  copyButtonElement,
  highlight,
}) {
  const sourceText = Mustache.render(templateText, data);

  if (highlight) {
    // add syntax coloring in a worker
    const worker = new Worker("highlighter.js");
    worker.onmessage = (event) => {
      codeElement.innerHTML = event.data;
    };
    worker.postMessage(sourceText);
  }

  codeElement.innerHTML = sourceText;

  copyButtonElement.onclick = () =>
    navigator.clipboard.writeText(codeElement.innerText);
}

// display
window.onload = async () => {
  const cssText = await concatFiles(["darkTheme.css"]);
  const jsText = await concatFiles([
    "frequency.js",
    "externalLinksAsNewTabs.js",
    "addJishoSentenceSearch.js",
  ]);

  // production javascript
  displaySourceFiles({
    data: { js: jsText, language: "plaintext" },
    templateText: "{{{js}}}",
    codeElement: document.getElementById("customizations-js"),
    copyButtonElement: document.getElementById("copy-js-customizations-button"),
  });

  // production css
  displaySourceFiles({
    data: { css: cssText },
    templateText: "{{{css}}}",
    codeElement: document.getElementById("customizations-css"),
    copyButtonElement: document.getElementById(
      "copy-css-customizations-button"
    ),
    highlight: true,
  });

  // dev import
  displaySourceFiles({
    data: { css: JSON.stringify(cssText), js: JSON.stringify(jsText) },
    templateText: document.getElementById("dev-import-template").innerHTML,
    codeElement: document.getElementById("dev-import"),
    copyButtonElement: document.getElementById("copy-dev-button"),
    highlight: true,
  });
};
