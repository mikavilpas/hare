import { Dictionary } from "lodash";

// This class is modeled after yomichan's "data file containing term
// information",
// https://github.com/FooSoft/yomichan/blob/master/ext/data/schemas/dictionary-term-bank-v3-schema.json

export interface YomichanTerm {
  dictionaryName: string;
  expression: string;
  reading: string;

  // Tags
  //
  // "String of space-separated tags for the definition. An empty string is
  // treated as no tags."
  tags: string;

  // Rules
  //
  // "String of space-separated rule identifiers for the definition which is
  // used to validate delinflection. Valid rule identifiers are: v1: ichidan
  // verb; v5: godan verb; vs: suru verb; vk: kuru verb; adj-i: i-adjective.
  // An empty string corresponds to words which aren't inflected, such as
  // nouns."
  rules: string;

  // Popularity
  // "Score used to determine popularity. Negative values are more rare and
  // positive values are more frequent. This score is also used to sort
  // search results."
  popularity: number;
  definitions: string[];
}

export type AnkiFieldContentType =
  | "(empty)"
  | "sentence"
  | "definition"
  | "englishTranslation"
  | "audio"
  | "word";

export type FieldValues = Dictionary<AnkiFieldContentType>;

export interface YomichanDictionary {
  name: string;
  alias: string;
}

export interface DictionarySetting {
  dictionaryName: string;
  positionType: string;
  position: number;
}

export interface DictionaryAndDictionarySetting {
  dictionary: YomichanDictionary;
  setting?: DictionarySetting;
}
/** All allowed keys for settings */

export enum SettingKey {
  ankiconnect_address = "ankiconnect_address",
  ankiconnect_selectedDeckName = "ankiconnect_selectedDeckName",
  ankiconnect_selectedModelName = "ankiconnect_selectedModelName",
  ankiconnect_fieldValueMapping = "ankiconnect_fieldValueMapping",
}

export interface Setting {
  key: SettingKey;
  value: string;
}

export interface AnkiConnectSettingData {
  address: string;
  selectedDeckName: string;
  selectedModelName: string;
  fieldValueMapping: FieldValues;
}

export enum YomichanDatabaseVersion {
  version01 = 1,
  version02 = 2,
  latest = 3,
}
