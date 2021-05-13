import axios from "axios";

export async function getDicts() {
  try {
    const dicts = await axios.get("/dict?api=1");
    return [dicts];
  } catch (e) {
    return [null, e];
  }
}

export async function getWordDefinitions({ dict, word, searchType = 0 }) {
  // https://sakura-paris.org/About/%E5%BA%83%E8%BE%9E%E8%8B%91%E7%84%A1%E6%96%99%E6%A4%9C%E7%B4%A2/API
  // API Query Params
  // q: search keyword（UTF-8 urlencode）
  // dict: dictionary name（UTF-8 urlencode）
  // type: (optional) search type。 0 = 前方一致, 1 = 後方一致, 2 = 完全一致。default = 0 (前方一致)
  // romaji: (optional) "ローマ字変換" enable switch。0 = 無効 (disable), 1 = 有効 (enable)。default = 0
  // max: (optional) max results number limit。default =　40. (Valid range: 1-40)
  // marker: (optional) Pagination marker, see above.
  //   page & offset: use these params (instead of "q" param) to fetch a specific word from dict.

  const params = new URLSearchParams();
  try {
    params.append("api", 1);
    params.append("dict", dict);
    params.append("q", word);
    params.append("type", searchType);

    const result = await axios.get(`/dict?${params.toString()}`);

    const data = result?.data;
    if (Array.isArray(data)) {
      // convert array format to object format
      const objectFormat = { words: data };
      return [objectFormat];
    } else if (typeof data === "object" && data != null) {
      // no conversion necessary
      return [data];
    }
  } catch (e) {
    console.error(`Error searching with ${params}`, e);
    return [null, e];
  }
}
