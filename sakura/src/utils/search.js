import { default as groupBy } from "lodash/groupBy";
import { getWordDefinitions } from "../api";

export function searchYomichanAndApi(word, db, yomichanDicts, dicts) {
  const yomiSearchPromise = searchYomichan(word, db, yomichanDicts);
  const apiSearchPromises = searchApi(word, dicts);

  return [yomiSearchPromise || Promise.resolve([]), apiSearchPromises || []];
}

export async function searchSingleDict(word, dictAlias, db, yomichanDicts) {
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

// for now searches all dictionaries at the same time
async function searchYomichan(word, db, yomichanDicts) {
  const yomiSearchPromise = db?.searchPrefix(word).then((terms) => {
    const results = terms.map((term) => {
      return {
        heading: `${term.reading} 【${term.expression}】`,
        text: term.definitions.join("\n"),
        term,
      };
    });

    // group by the dictionary's long (official) name, such as "JMdict
    // (English)" so they can be saved into individual dictionaries' results
    const byDictionary = groupBy(results, (t) => t.term.dictionaryName);

    return mapValues(byDictionary, ([dictionaryName, words]) => {
      // get the alias for the dictionary, such as "jmdict"
      const dictionary = yomichanDicts.find((d) => d.name === dictionaryName);
      const alias = dictionary?.alias || "";
      const val = { alias, word, result: { words }, error: undefined };
      return [dictionaryName, val];
    });
  });
  return yomiSearchPromise;
}

function searchApi(word, dicts) {
  const promiseArray = dicts?.map((dict) =>
    getWordDefinitions({
      dict: dict,
      word: word,
    }).then(([result, error]) => {
      return { alias: dict, word, result, error };
    })
  );

  return promiseArray;
}

function mapValues(obj, mapFunction) {
  return Object.fromEntries(Object.entries(obj).map(mapFunction));
}
