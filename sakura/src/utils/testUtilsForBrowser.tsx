import YomichanDatabase from "./yomichan/yomichanDatabase";

export function newDatabase() {
  indexedDB.deleteDatabase("hare-yomichan");
  return new YomichanDatabase();
}
