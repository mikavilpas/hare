import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("css", css);

onmessage = (event) => {
  const result = hljs.highlightAuto(event.data);
  postMessage(result.value);
};
