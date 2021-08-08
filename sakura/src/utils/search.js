import { default as groupBy } from "lodash/groupBy";
import { getWordDefinitions } from "../api";

export function searchYomichanAndApi(word, db, yomichanDicts, dicts) {
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

    return Object.entries(byDictionary).map(([dictionaryName, words]) => {
      // get the alias for the dictionary, such as "jmdict"
      const dictionary = yomichanDicts.find((d) => d.name === dictionaryName);
      const alias = dictionary.alias;
      return { alias, word, result: { words }, error: undefined };
    });
  });

  const apiSearchPromises = dicts?.map((dict) =>
    getWordDefinitions({
      dict: dict,
      word: word,
    }).then(([result, error]) => {
      return { alias: dict, word, result, error };
    })
  );

  return [yomiSearchPromise || Promise.resolve([]), apiSearchPromises || []];
}
