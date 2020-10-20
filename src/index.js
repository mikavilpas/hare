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

async function displayDevSourceFile({
  files,
  templateText,
  codeElement,
  copyButtonElement,
}) {
  const file = files[0]; // only one supported for now
  const source = await sourceCodeService.loadFileText(file);
  const escapedSource = Mustache.render(templateText, {
    code: JSON.stringify(source),
  });

  codeElement.innerHTML = escapedSource;
  hljs.highlightBlock(codeElement);

  copyButtonElement.onclick = () =>
    navigator.clipboard.writeText(codeElement.innerText);
}

// display
window.onload = async () => {
  // css
  await displayDevSourceFile({
    files: ["darkTheme.css"],
    templateText: document.getElementById("css-import-template").innerHTML,
    codeElement: document.getElementById("css-import"),
    copyButtonElement: document.getElementById("copy-css-button"),
  });

  // js
  await displayDevSourceFile({
    files: ["externalLinksAsNewTabs.js"],
    templateText: document.getElementById("js-import-template").innerHTML,
    codeElement: document.getElementById("js-import"),
    copyButtonElement: document.getElementById("copy-js-button"),
  });
};
