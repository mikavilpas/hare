import YomichanDatabase from "./yomichan/Types";

export function newDatabase() {
  indexedDB.deleteDatabase("hare-yomichan");
  return new YomichanDatabase();
}
