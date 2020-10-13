import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import "./styles/style.css"


export function devCssImportCommand() {
  return `
      window.__STORE__.dispatch(window.__ACTIONS__.updateUserConfig({
        css: "body{margin:0;background-color:#add8e6}#main-content{font-size:x-large}fieldset.dicts>.dict{margin:6px}",
        js: ""
      }));`;
}

// display
var css = document.getElementById("css-import");
css.innerHTML = devCssImportCommand();
