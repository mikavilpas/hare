import YomichanDatabase from "./yomichanDatabase";

export function newDatabase() {
  const FDBFactory = require("fake-indexeddb/lib/FDBFactory");

  // Whenever you want a fresh indexedDB
  const indexedDB = new FDBFactory();
  const db = new YomichanDatabase({ indexedDB, IDBKeyRange });
  return db;
}
