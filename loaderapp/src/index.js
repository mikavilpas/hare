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
  sourceText,
  codeElement,
  copyButtonElement,
  highlight,
}) {
  if (highlight) {
    // add syntax coloring in a worker
    const worker = new Worker("highlighter.js");
    worker.onmessage = (event) => {
      codeElement.innerHTML = event.data;
    };
    worker.postMessage(sourceText);
  }

  codeElement.innerHTML = sourceText;

  copyButtonElement.onclick = () => navigator.clipboard.writeText(sourceText);
}

// display
window.onload = async () => {
  // production import
  const base = "https://sp3ctum.github.io/sakura-paris-customizations";

  async function productionImport() {
    displaySourceFiles({
      sourceText: Mustache.render(
        document.getElementById("prod-import-template").innerHTML,
        {
          jsFile: `${base}/prod.js`,
          cssFile: `${base}/prod.css`,
          newUiJsFile: `${base}/new-ui/main.js`,
          newUiCssFile: `${base}/new-ui/main.css`,
        }
      ),
      codeElement: document.getElementById("customizations-js"),
      copyButtonElement: document.getElementById(
        "copy-js-customizations-button"
      ),
      highlight: true,
    });
  }

  async function devImport() {
    // dev import
    const cssText = await concatFiles(["prod.css"]);
    const jsText = await concatFiles(["prod.js"]);

    displaySourceFiles({
      sourceText: Mustache.render(
        document.getElementById("dev-import-template").innerHTML,
        { css: JSON.stringify(cssText), js: JSON.stringify(jsText) }
      ),
      codeElement: document.getElementById("dev-import"),
      copyButtonElement: document.getElementById("copy-dev-button"),
      highlight: true,
    });
  }

  async function newUiDevImport() {
    // dev import
    const cssText = await concatFiles(["new-ui/main.css"]);
    const jsText = await concatFiles(["new-ui/main.js"]);

    displaySourceFiles({
      sourceText: Mustache.render(
        document.getElementById("new-ui-dev-import-template").innerHTML,
        { css: JSON.stringify(cssText), js: JSON.stringify(jsText) }
      ),
      codeElement: document.getElementById("new-ui-dev-import"),
      copyButtonElement: document.getElementById("copy-new-ui-dev-button"),
      highlight: true,
    });
  }

  productionImport();
  devImport();
  newUiDevImport();
};
