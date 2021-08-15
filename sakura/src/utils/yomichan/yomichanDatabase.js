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

export class YomichanDictionary {
  constructor(name, alias) {
    this.name = name;
    this.alias = alias;
  }
}

export class DictionarySetting {
  /**
     @param positionType {string}
     @param position {number}
  */
  constructor(dictionaryName, positionType, position) {
    this.dictionaryName = dictionaryName;
    this.positionType = positionType;
    this.position = position;
  }
}

export class DictionaryAndDictionarySetting {
  constructor(dictionary, setting) {
    this.dictionary = dictionary;
    this.setting = setting;
  }
}

export default class YomichanDatabase {
  constructor() {
    this.db = databaseVersions.version02();

    // open the db to force migrations to happen now instead of lazily
    this.db.open();
  }

  /** @returns {Promise<YomichanDictionary[]>}
   */
  async getDictionaries() {
    return this.db.dictionaries.toArray();
  }

  /** @returns {Promise<DictionaryAndDictionarySetting[]>}
   */
  async getDictionariesAndSettings() {
    const settings = await this.db.dictionarySettings.toArray();
    const dicts = await this.db.dictionaries.toArray();

    const joined = dicts.map((d) => {
      const setting = settings.find((s) => s.dictionaryName === d.name);
      return new DictionaryAndDictionarySetting(d, setting);
    });

    return joined;
  }

  async addDictionary(
    dictionaryName,
    alias,
    position = 0,
    positionType = "before"
  ) {
    const lastDictionary = await this.db.dictionaries.toCollection().last();
    const dict = new YomichanDictionary(dictionaryName, alias);
    await this.db.dictionaries.add(dict);

    const setting = new DictionarySetting(
      dictionaryName,
      positionType,
      position
    );
    await this.db.dictionarySettings.add(setting);
  }

  async updateDictionarySettings(dictionaryName, newSettings) {
    const { positionType, position } = newSettings;
    await this.db.dictionarySettings
      .where({ dictionaryName })
      .modify({ positionType, position });
  }

  async deleteDictionary(dictionaryName) {
    await this.db.transaction(
      "rw",
      this.db.dictionaries,
      this.db.terms,
      this.db.dictionarySettings,
      async () => {
        await this.db.dictionarySettings.where({ dictionaryName }).delete();
        await this.db.dictionaries.where({ name: dictionaryName }).delete();
        await this.db.terms.where({ dictionaryName }).delete();
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

// Entrypoint for database versioning and migrations. Used in production as well
// as in testing, to test the migrations.
export const databaseVersions = {
  version01() {
    const db = new Dexie("hare-yomichan");

    // yomichan's database schema available at
    // https://github.com/FooSoft/yomichan/blob/master/ext/js/language/dictionary-database.js
    db.version(1).stores({
      // when a dictionary is uploaded, it's possible to set a custom name for it.
      dictionaries: `name, alias`,

      terms: `++id, dictionaryName, expression, reading`,
    });

    return db;
  },

  version02(db = this.version01()) {
    db.version(2)
      .stores({
        // dictionaries can now have custom positions
        dictionarySettings: `dictionaryName, positionType, position`,
      })
      .upgrade(async (tx) => {
        // Add `position` to the dicts. At this point only a single dict was
        // supported so this is overkill.
        const dicts = await tx.table("dictionaries").toCollection();
        dicts.each((d) =>
          // by default the dicts will be at the start
          tx.dictionarySettings.add(new DictionarySetting(d.name, "start", 0))
        );
      });

    return db;
  },
};
