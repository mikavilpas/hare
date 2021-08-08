import Dexie from "dexie";

class YomichanTerm {
  constructor(
    dictionaryName,
    expression,
    reading,
    tags,
    rules,
    popularity,
    definitions
  ) {
    this.dictionaryName = dictionaryName;
    this.expression = expression;
    this.reading = reading;

    // This class is modeled after yomichan's "data file containing term
    // information",
    // https://github.com/FooSoft/yomichan/blob/master/ext/data/schemas/dictionary-term-bank-v3-schema.json

    // Tags
    //
    // "String of space-separated tags for the definition. An empty string is
    // treated as no tags."
    this.tags = tags;

    // Rules
    //
    // "String of space-separated rule identifiers for the definition which is
    // used to validate delinflection. Valid rule identifiers are: v1: ichidan
    // verb; v5: godan verb; vs: suru verb; vk: kuru verb; adj-i: i-adjective.
    // An empty string corresponds to words which aren't inflected, such as
    // nouns."
    this.rules = rules;

    // Popularity
    // "Score used to determine popularity. Negative values are more rare and
    // positive values are more frequent. This score is also used to sort
    // search results."
    this.popularity = popularity;

    this.definitions = definitions;
  }
}

class YomichanDictionary {
  constructor(name, alias) {
    this.name = name;
    this.alias = alias;
  }
}

export default class YomichanDatabase {
  constructor(dexieOptions = {}) {
    // tests can override the real db with a fake one
    this.dexieOptions = dexieOptions;
    this.db = new Dexie("hare-yomichan", dexieOptions);

    // yomichan's database schema available at
    // https://github.com/FooSoft/yomichan/blob/master/ext/js/language/dictionary-database.js
    this.db.version(1).stores({
      // when a dictionary is uploaded, it's possible to set a custom name for it.
      dictionaries: `name, alias`,

      terms: `++id, dictionaryName, expression, reading`,
    });
  }

  /** @returns {Promise<YomichanDictionary[]>}
   */
  async getDictionaries() {
    return this.db.dictionaries.toArray();
  }

  async addDictionary(dictionaryName, alias, callback) {
    const dict = new YomichanDictionary(dictionaryName, alias);
    await this.db.dictionaries.add(dict);
  }

  async deleteDictionary(dictionaryName) {
    await this.db.transaction(
      "rw",
      this.db.dictionaries,
      this.db.terms,
      async () => {
        await this.db.dictionaries.where({ name: dictionaryName }).delete();
        await this.db.terms.where({ dictionaryName: dictionaryName }).delete();
      }
    );
  }

  async getDictionaryMetadata(dictionaryName) {
    const termCount = await this.db.terms
      .where({ dictionaryName: dictionaryName })
      .count();
    return { termCount: termCount };
  }

  async addTerms(dictionaryName, termData) {
    const terms = termData.map((t) => {
      const data = [dictionaryName, ...t];
      return new YomichanTerm(...data);
    });
    await this.db.terms.bulkAdd(terms);
    // TODO handle errors
  }

  /** @returns {Promise<YomichanTerm[]>}
   */
  async searchPrefix(searchQuery) {
    return this.db.terms
      .where("expression")
      .startsWith(searchQuery)
      .or("reading")
      .startsWith(searchQuery)
      .limit(20)
      .toArray();
  }
}
