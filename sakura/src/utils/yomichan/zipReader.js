import * as JSZip from "jszip";

export async function readZip(data) {
  const jszip = new JSZip();

  // accepts "String/Array of bytes/ArrayBuffer/Uint8Array/Buffer/Blob/Promise"
  const zip = await jszip.loadAsync(data);
  return zip;
}

export async function readJsonInsideZip(zip, fileName) {
  const raw = await zip.file(fileName).async("text");
  const json = JSON.parse(raw);
  return json;
}
