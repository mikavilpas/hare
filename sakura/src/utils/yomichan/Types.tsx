import Dexie, { Transaction } from "dexie";
import {
  AnkiConnectSettingData,
  DictionaryAndDictionarySetting,
  DictionarySetting,
  Setting,
  SettingKey,
  YomichanDatabaseVersion,
  YomichanDictionary,
  YomichanTerm,
} from "./YomichanDictionary";

export default class YomichanDatabase extends Dexie {
  dictionaries!: Dexie.Table<YomichanDictionary, number>;
  terms!: Dexie.Table<YomichanTerm, number>;
  dictionarySettings!: Dexie.Table<DictionarySetting, number>;
  settings!: Dexie.Table<Setting, number>;

  constructor(
    version: YomichanDatabaseVersion = YomichanDatabaseVersion.latest
  ) {
    super("hare-yomichan");

    if (version >= 1) {
      // yomichan's database schema available at
      // https://github.com/FooSoft/yomichan/blob/master/ext/js/language/dictionary-database.js
      this.version(1).stores({
        // when a dictionary is uploaded, it's possible to set a custom name for it.
        dictionaries: `name, alias`,

        terms: `++id, dictionaryName, expression, reading`,
      });
    }

    if (version >= 2) {
      this.version(2)
        .stores({
          // dictionaries can now have custom positions
          dictionarySettings: `dictionaryName, positionType, position`,
        })
        .upgrade(async (tx) => {
          // Add `position` to the dicts. At this point only a single dict was
          // supported so this is overkill.
          const dicts = tx.table("dictionaries").toCollection();
          dicts.each((d) =>
            // by default the dicts will be at the start
            tx.table("dictionarySettings").add({
              dictionaryName: d.name,
              positionType: "start",
              position: 0,
            })
          );
        });
    }

    const addDefaultAnkiSettings = async (tx: Transaction) => {
      const settings = tx.table("settings");
      settings.add({
        key: "ankiconnect_address",
        value: "http://127.0.0.1:8765",
      });
      settings.add({ key: "ankiconnect_selectedDeckName", value: "" });
      settings.add({ key: "ankiconnect_selectedModelName", value: "" });
      settings.add({ key: "ankiconnect_fieldValueMapping", value: {} });
    };
    if (version >= 3) {
      this.version(3)
        .stores({
          // new table for storing miscellaneous settings of the application.
          settings: `key, value`,
        })
        .upgrade(async (tx) => {
          // add default ankiconnect settings
          addDefaultAnkiSettings(tx);
        });
    }

    this.on("populate", async (tx) => {
      if (this.verno >= 3) {
        addDefaultAnkiSettings(tx);
      }
    });

    // open the db to force migrations to happen now instead of lazily
    this.open();
  }

  async getDictionaries(): Promise<YomichanDictionary[]> {
    return this.dictionaries.toArray();
  }

  async getDictionariesAndSettings(): Promise<
    DictionaryAndDictionarySetting[]
  > {
    const settings = await this.dictionarySettings.toArray();
    const dicts = await this.dictionaries.toArray();

    const joined: DictionaryAndDictionarySetting[] = dicts.map((d) => {
      const setting = settings.find((s) => s.dictionaryName === d.name);
      return { dictionary: d, setting: setting };
    });

    return joined;
  }

  async addDictionary(
    dictionaryName: string,
    alias: string,
    position = 0,
    positionType = "before"
  ): Promise<void> {
    const dict: YomichanDictionary = { name: dictionaryName, alias };
    await this.dictionaries.add(dict);

    const setting = { dictionaryName, positionType, position };
    await this.dictionarySettings.add(setting);
  }

  async updateDictionarySettings(
    dictionaryName: string,
    newSettings: Partial<DictionarySetting>
  ): Promise<void> {
    const { positionType, position } = newSettings;
    await this.dictionarySettings
      .where({ dictionaryName })
      .modify({ positionType, position });
  }

  async deleteDictionary(dictionaryName: string): Promise<void> {
    await this.transaction(
      "rw",
      this.dictionaries,
      this.terms,
      this.dictionarySettings,
      async () => {
        await this.dictionarySettings.where({ dictionaryName }).delete();
        await this.dictionaries.where({ name: dictionaryName }).delete();
        await this.terms.where({ dictionaryName }).delete();
      }
    );
  }

  async getDictionaryMetadata(
    dictionaryName: string
  ): Promise<{ termCount: number }> {
    const termCount = await this.terms
      .where({ dictionaryName: dictionaryName })
      .count();
    return { termCount: termCount };
  }

  async addTerms(dictionaryName: string, termData: unknown[][]): Promise<void> {
    const terms = termData.map((t) => {
      const term: YomichanTerm = {
        dictionaryName: dictionaryName,
        expression: t[0] as string,
        reading: t[1] as string,
        tags: t[2] as string,
        rules: t[3] as string,
        popularity: t[4] as number,
        definitions: t[5] as string[],
      };
      return term;
    });
    await this.terms.bulkAdd(terms);
    // TODO handle errors
  }

  async searchPrefix(searchQuery: string): Promise<YomichanTerm[]> {
    return this.terms
      .where("expression")
      .startsWith(searchQuery)
      .or("reading")
      .startsWith(searchQuery)
      .limit(20)
      .toArray();
  }

  async saveAnkiConnectSetting(keyName: string, value: string) {
    const key = `ankiconnect_${keyName}`;

    const allowedKeys = new Set([
      "ankiconnect_address",
      "ankiconnect_selectedDeckName",
      "ankiconnect_selectedModelName",
      "ankiconnect_fieldValueMapping",
    ]);

    if (!allowedKeys.has(key)) {
      throw new Error("unsupported key " + key);
    }

    const existing = await this.settings.get({ key });
    if (!existing) {
      throw new Error("unknown setting key " + key);
    }

    await this.settings.where({ key }).modify({ value });
  }

  async getAnkiConnectSettings(): Promise<{ data: AnkiConnectSettingData }> {
    const rawSettings = await this.settings
      .where("key")
      .startsWith("ankiconnect_")
      .toArray();

    const valueOf = (key: SettingKey): any =>
      rawSettings.find((s) => s.key === key)?.value;
    const settings: AnkiConnectSettingData = {
      address: valueOf(SettingKey.ankiconnect_address) || "",
      selectedDeckName: valueOf(SettingKey.ankiconnect_selectedDeckName) || "",
      selectedModelName:
        valueOf(SettingKey.ankiconnect_selectedModelName) || "",
      fieldValueMapping:
        valueOf(SettingKey.ankiconnect_fieldValueMapping) || {},
    };

    return { data: settings };
  }
}
