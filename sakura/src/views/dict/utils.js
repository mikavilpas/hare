import config from "../../config";
import { tokenize as daijirin } from "../../utils/formatting/daijirin";
import { tokenize as daijisen } from "../../utils/formatting/daijisen";
import { tokenize as defaultFormat } from "../../utils/formatting/formatting";
import { tokenize as kogo } from "../../utils/formatting/kogo";
import { tokenize as koujien } from "../../utils/formatting/koujien";
import { tokenize as shinjirin } from "../../utils/formatting/shinjirin";
import { tokenize as shinmeikai } from "../../utils/formatting/shinmeikai";
import BbcodeTokenProcessor from "./tokenProcessors/bbcodeTokenProcessor";
import DefinitionTokenProcessor from "./tokenProcessors/definitionTokenProcessor";

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

// Format and enhance definitions for supported dictionaries, or fallback to
// default (simple) formatting.
export function prettyText(text, options = {}) {
  const bbcodeProcessor = new BbcodeTokenProcessor(options);

  const preProcess = (formatFunction) => {
    const args = {
      ...options,
      formatFunction,
    };
    const definitionProcessor =
      options.createTokenProcessor?.(args) ||
      new DefinitionTokenProcessor(args);
    text = definitionProcessor.convertInputText(text);
    const html = bbcodeProcessor.convertInputText(text);
    return html;
  };

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
  } else if (options.dict === "古語") {
    return preProcess(kogo);
  } else {
    const args = {
      ...options,
      formatFunction: defaultFormat,
    };
    const definitionProcessor =
      options.createTokenProcessor?.(args) ||
      new DefinitionTokenProcessor(args);
    text = definitionProcessor.convertInputText(text);
    const html = bbcodeProcessor.convertInputText(text);
    return html;
  }
}
