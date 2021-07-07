import config from "../../config";
import { tokenize as tokenizeBbcode } from "../../utils/bbcode";
import { tokenize as daijirin } from "../../utils/formatting/daijirin";
import { tokenize as daijisen } from "../../utils/formatting/daijisen";
import { tokenize as format } from "../../utils/formatting/formatting";
import { tokenize as koujien } from "../../utils/formatting/koujien";
import { tokenize as shinjirin } from "../../utils/formatting/shinjirin";
import { tokenize as shinmeikai } from "../../utils/formatting/shinmeikai";

// Dictionaries to display and preload results for. These are either the id or
// alias properties from the config.dictinfo
export const preferredDictionaries = [
  "広辞苑",
  "大辞林",
  "大辞泉",
  "新辞林",
  "古語",
  "日国",
  "学国",
  "明鏡",
  "新明解",
  "漢和",
  "英辞郎",
];

// Some dicts are reported by the api with a very long name, but then the api
// only accepts the short name when querying (bug?). Converts a dict name to
// short form.
export function dictInfo(dictAliasOrId) {
  const d = config.dictinfo.dicts.find(
    (d) => d?.alias == dictAliasOrId || d?.id == dictAliasOrId
  );
  if (!d) console.warn(`Unable to find the dict ${dictAliasOrId}`);
  return d;
}

export function dictShortName(dictAliasOrId) {
  const dictObject = dictInfo(dictAliasOrId);
  return dictObject?.alias || dictObject?.id;
}

export const urls = {
  recursiveLookup:
    "/dict/:dictname/:searchmode/:search/:openeditem/recursive/:rdict/:rsearchmode/:rsearch/:ropeneditem",
  lookup: "/dict/:dictname/:searchmode/:search/:openeditem",
};

export function bbcode2Html(bbcodeText, options) {
  const convertTokensToHtml = (t) => {
    if (typeof t === "string") {
      return t;
    }

    // recurse
    const content = t.content.map((c) => convertTokensToHtml(c)).join("");

    if (t.type === "keyword") return `<mark>${content}</mark>`;
    if (t.type === "subscript") return `<sub>${content}</sub>`;
    if (t.type === "superscript") return `<sup>${content}</sup>`;
    if (t.type === "decoration") return `<b>${content}</b>`;
    if (t.type === "emphasis") return `<em>${content}</em>`;

    // TODO render <a>
    if (t.type === "reference") return content;
    if (t.type === "image") {
      if (options.renderComplexTags) {
        // hyperlinks with % symbols get mangled by the text analysis phase, breaking the html
        const src = `/dict/?api=1&binary=${t.format}&dict=${options.dict}&offset=${t.offset}&page=${t.page}`;
        return `<img title="${t.content}" src="${src}" />`;
      } else {
        // return the tag unchanged so it can be converted to html after the
        // text analysis is complete
        return t.asText;
      }
    }

    return t?.content || t; // unknown tags or no tags at all
  };

  try {
    const parseResult = tokenizeBbcode(bbcodeText);
    return parseResult.value.map((t) => convertTokensToHtml(t)).join("");
  } catch (e) {
    // fallback in case the format changes - the user must see something
    console.warn("Unable to htmlize bbcode", bbcodeText, e);
    return bbcodeText;
  }
}

export function prettifyLines(text) {
  // must receive text in a non-bbcode format!
  return text
    ?.split(/\n/)
    .filter((line) => line.trim() !== "") // remove empty lines
    .map((line, i) => {
      return `<p class="definition-row"> ${line} </p> `;
    });
}

function highlightQuotes(text) {
  const convertTokensToHtml = (t) => {
    if (typeof t === "string") {
      return t;
    } else if (t.type === "quote") {
      return `<span class="quote border border-dark rounded">${t.content}</span>`;
    } else {
      console.warn("Unexpected token", t);
      return t;
    }
  };

  try {
    const parseResult = format(text);
    return parseResult.value.map((t) => convertTokensToHtml(t)).join("");
  } catch (e) {
    console.warn("Unable to highlight quotes", e);
    console.log(text);
    return text;
  }
}

function formatDefinition(text, formatFunction) {
  const convertTokensToHtml = (t) => {
    if (typeof t === "string") {
      return t;
    } else if (t.type === "linebreak") {
      return "<br />";
    } else {
      const content = t.content.map(convertTokensToHtml).join("");
      let level = 0;
      switch (t.type) {
        case "firstLevelDefinition":
          level = 1;
          break;
        case "secondLevelDefinition":
          level = 2;
          break;
        case "thirdLevelDefinition":
          level = 3;
          break;
        default:
          console.warn("Unexpected token", t);
          return t;
      }
      return `<div class="definition-section level-${level}">
                <span class="heading">${t.heading}</span>
                <div class="content">${content}</div>
              </div>`;
    }
  };

  let parseResult; // helps debugging
  try {
    parseResult = formatFunction(text);
    const result = parseResult.value
      .map((t) => convertTokensToHtml(t))
      .join("");
    return result;
  } catch (e) {
    console.warn("Unable to format dictionary definition text", e);
    console.log(text);
    return text;
  }
}

export function prettyText(text, options) {
  const preProcess = (formatFunction) => {
    text = formatDefinition(text, formatFunction);
    const html = bbcode2Html(text, options);
    const withQuotes = highlightQuotes(html);

    return withQuotes;
  };
  // pre process definitions into html for supported dictionaries
  if (options.dict === "大辞泉") {
    return preProcess(daijisen);
  } else if (options.dict === "大辞林") {
    return preProcess(daijirin);
  } else if (options.dict === "広辞苑") {
    return preProcess(koujien);
  } else if (options.dict === "新明解") {
    return preProcess(shinmeikai);
  } else if (options.dict === "新辞林") {
    return preProcess(shinjirin);
  } else {
    const html = bbcode2Html(text, options);
    // console.log(html);
    const lines = prettifyLines(highlightQuotes(html));
    return lines.join("");
  }
}
