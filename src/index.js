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

async function displayDevSourceFiles({
  cssFiles,
  jsFiles,
  templateText,
  codeElement,
  copyButtonElement,
}) {
  const cssText = await concatFiles(cssFiles);
  const jsText = await concatFiles(jsFiles);

  const escapedSource = Mustache.render(templateText, {
    css: JSON.stringify(cssText),
    js: JSON.stringify(jsText),
  });

  codeElement.innerHTML = escapedSource;
  hljs.highlightBlock(codeElement);

  copyButtonElement.onclick = () =>
    navigator.clipboard.writeText(codeElement.innerText);
}

// display
window.onload = async () => {
  await displayDevSourceFiles({
    cssFiles: ["darkTheme.css"],
    jsFiles: ["externalLinksAsNewTabs.js", "addJishoSentenceSearch.js"],
    templateText: document.getElementById("dev-import-template").innerHTML,
    codeElement: document.getElementById("dev-import"),
    copyButtonElement: document.getElementById("copy-dev-button"),
  });
};
