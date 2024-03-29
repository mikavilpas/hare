import { AxiosInstance } from "axios";
import { setup } from "axios-cache-adapter";
import { dictInfo } from "./views/dict/utils";

// Create `axios` instance with pre-configured `axios-cache-adapter` attached to it
const api: AxiosInstance = setup({
  // `axios` options
  // baseURL: 'http://some-rest.api',

  //
  // `axios-cache-adapter` options
  cache: {
    maxAge: 15 * 60 * 1000,
    exclude: {
      // allow caching requests with ?query parameters
      query: false,
      // Only exclude PUT, PATCH and DELETE methods from cache
      methods: ["put", "patch", "delete"],
    },
  },
});

export type ApiResponse<T, E = any> =
  | [response: T, error: undefined]
  | [response: undefined, error: E];

export async function getDicts(): Promise<ApiResponse<string[]>> {
  try {
    const dicts = await api.get("/dict/?api=1");
    return [dicts.data, undefined];
  } catch (e) {
    return [undefined, e];
  }
}

// old response type from the api
type GetWordDefinitionsApiLegacyResponse = [
  {
    heading: string;
    text: string;
  }
];

// new response type from the api
export interface GetWordDefinitionsApiResponse {
  words: [
    {
      heading: string;
      text: string;
      page: number;
      offset: number;
    }
  ];
  nextPageMarker: string;
}

// the response type from this api module
export interface WordDefinition {
  heading: string;
  text: string;
}
export interface GetWordDefinitionsResponse {
  words: [WordDefinition];
}

export async function getWordDefinitions({
  dict,
  word,
  searchType = 0,
}: {
  dict: string;
  word: string;
  searchType?: number;
}): Promise<ApiResponse<GetWordDefinitionsResponse>> {
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
  const dictObject = dictInfo(dict);
  if (!dictObject) throw "dict not found";

  try {
    params.append("api", "1");
    params.append("dict", dictObject.id);
    params.append("q", word);
    params.append("type", searchType.toString());

    // the api can respond with two different kinds of responses
    const result = await api.get<
      GetWordDefinitionsApiLegacyResponse | GetWordDefinitionsApiResponse
    >(`/dict/?${params.toString()}`);

    // unify the responses so we can process them with the same code
    const data = result?.data;
    if (Array.isArray(data)) {
      // convert array format to object format
      const objectFormat: GetWordDefinitionsResponse = { words: data };
      return [objectFormat, undefined];
    } else if (typeof data === "object" && data != null) {
      // no conversion necessary
      return [data, undefined];
    } else {
      throw "Unexpected api response. The word search api has changed or there was some other unexpected error.";
    }
  } catch (e) {
    console.error(`Error searching with ${params}`, e);
    return [undefined, e];
  }
}

export async function textAnalysis(
  textHtml: string
): Promise<ApiResponse<string>> {
  try {
    const data = textHtml;
    const response = await api.post(`/dict/?api=2&type=4`, data, {
      headers: { "content-type": "text/plain" },
    });
    return [response.data, undefined];
  } catch (e) {
    return [undefined, e];
  }
}
