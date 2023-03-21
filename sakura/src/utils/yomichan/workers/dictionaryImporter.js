import * as Comlink from "comlink";
import YomichanDatabase from "../Types";

// accepts an arraybuffer because it's a Transferable
// https://developer.mozilla.org/en-US/docs/Web/API/Transferable
export async function importDictionaryAndTerms(dictName, termBankArrayBuffer) {
  const termData = readArrayBufferAsJson(termBankArrayBuffer);

  const db = new YomichanDatabase();
  await db.addTerms(dictName, termData);
}

function readArrayBufferAsJson(ab) {
  const text = new TextDecoder().decode(ab);
  const json = JSON.parse(text);
  return json;
}

Comlink.expose({ importDictionaryAndTerms });
