import axios from "axios";
import { Dictionary } from "lodash";
import { default as groupBy } from "lodash/groupBy";
import { getWordDefinitions, WordDefinition } from "../api";
import YomichanDatabase from "./yomichan/Types";
import {
  YomichanDictionary,
  YomichanTerm,
} from "./yomichan/YomichanDictionary";

export type AudioSentenceSearchResult = {
  jap: string;
  source: string;
  audio_jap: string;
  eng: string;
};

export async function searchAudioExampleSentencesApi(
  word: string
): Promise<AudioSentenceSearchResult[]> {
  const apiUrl =
    "https://4o6cbb7hwwxbtxiygkdrw3bvr40ikrdl.lambda-url.eu-north-1.on.aws/";
  const response = await axios.get(apiUrl, { params: { query: word } });
  return response.data || [];
}

export function searchYomichanAndApi(
  word: string,
  db: YomichanDatabase,
  yomichanDicts: YomichanDictionary[],
  dicts: string[]
) {
  const yomiSearchPromise = searchYomichan(word, db, yomichanDicts);
  const apiSearchPromises = searchApi(word, dicts);

  return [yomiSearchPromise || Promise.resolve([]), apiSearchPromises || []];
}

export async function searchSingleDict(
  word: string,
  dictAlias: string,
  db: YomichanDatabase,
  yomichanDicts: YomichanDictionary[]
): Promise<DefinitionSearchResult> {
  const yomiDict = yomichanDicts.find((d) => d.alias === dictAlias);

  if (yomiDict) {
    const results = await searchYomichan(word, db, yomichanDicts);
    const resultObject = results?.[yomiDict.name];
    return resultObject;
  } else {
    const searchPromises = searchApi(word, [dictAlias]);
    const resultObject = await searchPromises?.[0];
    return resultObject;
  }
}

// the type we get from the yomichan db
export type YomichanWordDefinitionResult = {
  heading: string;
  text: string;
  term: YomichanTerm;
};

// the type we get from the sakura-paris search api
export type SakuraWordDefinitionResult = WordDefinition;

export type WordDefinitionResult =
  | YomichanWordDefinitionResult
  | SakuraWordDefinitionResult;

export type DefinitionSearchResult = {
  alias: string;
  word: string;
  result?: {
    words: WordDefinitionResult[];
  };
  error?: any;
};

// for now searches all dictionaries at the same time
async function searchYomichan(
  word: string,
  db: YomichanDatabase,
  yomichanDicts: YomichanDictionary[]
): Promise<Dictionary<DefinitionSearchResult>> {
  const yomiSearchPromise = db?.searchPrefix(word).then((terms) => {
    const results: YomichanWordDefinitionResult[] = terms.map((term) => {
      return {
        heading: `${term.reading} 【${term.expression}】`,
        text: term.definitions.join("\n"),
        term,
      };
    });

    // group by the dictionary's long (official) name, such as "JMdict
    // (English)" so they can be saved into individual dictionaries' results
    const byDictionary: Dictionary<YomichanWordDefinitionResult[]> = groupBy(
      results,
      (t: YomichanWordDefinitionResult) => t.term.dictionaryName
    );

    const dictionary: Dictionary<DefinitionSearchResult> = Object.fromEntries(
      Object.entries(byDictionary).map(
        (entry: [string, YomichanWordDefinitionResult[]]) => {
          const [dictionaryName, words] = entry;
          // get the alias for the dictionary, such as "jmdict"
          const dictionary = yomichanDicts.find(
            (d) => d.name === dictionaryName
          );
          const alias = dictionary?.alias || "";
          const val: DefinitionSearchResult = {
            alias,
            word,
            result: { words },
            error: undefined,
          };
          return [dictionaryName, val];
        }
      )
    );

    return dictionary;
  });
  return yomiSearchPromise;
}

function searchApi(
  word: string,
  dicts: string[]
): Promise<DefinitionSearchResult>[] {
  const promiseArray = dicts?.map((dict) =>
    getWordDefinitions({
      dict: dict,
      word: word,
    }).then(([result, error]) => {
      const res: DefinitionSearchResult = {
        alias: dict,
        word,
        result: result ? { words: result.words } : undefined,
        error,
      };
      return res;
    })
  );

  return promiseArray;
}
