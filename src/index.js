import "core-js/stable";
import "regenerator-runtime/runtime";

import "highlight.js/styles/github.css";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
hljs.registerLanguage("javascript", javascript);

import * as Mustache from "mustache";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";

import * as sourceCodeService from "./sourceCodeService.js";

async function concatFiles(files) {
  const jobs = files.map(sourceCodeService.loadFileText);
  return Promise.all(jobs).then((texts) => texts.join("\n"));
}

function displaySourceFiles({
  data,
  templateText,
  codeElement,
  copyButtonElement,
}) {
  const sourceText = Mustache.render(templateText, data);

  codeElement.innerHTML = sourceText;
  hljs.highlightBlock(codeElement);

  copyButtonElement.onclick = () =>
    navigator.clipboard.writeText(codeElement.innerText);
}

// display
window.onload = async () => {
  const cssText = await concatFiles(["darkTheme.css"]);
  const jsText = await concatFiles([
    "externalLinksAsNewTabs.js",
    "addJishoSentenceSearch.js",
  ]);

  // production css
  displaySourceFiles({
    data: { css: cssText },
    templateText: "{{css}}",
    codeElement: document.getElementById("customizations-css"),
    copyButtonElement: document.getElementById(
      "copy-css-customizations-button"
    ),
  });

  // production javascript
  displaySourceFiles({
    data: { js: jsText },
    templateText: "{{js}}",
    codeElement: document.getElementById("customizations-js"),
    copyButtonElement: document.getElementById("copy-js-customizations-button"),
  });

  // dev import
  displaySourceFiles({
    data: { css: JSON.stringify(cssText), js: JSON.stringify(jsText) },
    templateText: document.getElementById("dev-import-template").innerHTML,
    codeElement: document.getElementById("dev-import"),
    copyButtonElement: document.getElementById("copy-dev-button"),
  });
};
