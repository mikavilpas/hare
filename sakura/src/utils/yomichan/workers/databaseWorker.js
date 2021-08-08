/* eslint-disable import/no-webpack-loader-syntax */

// load yomichanDatabaseWorker as a web worker
import * as Comlink from "comlink";
import DatabaseWorker from "worker-loader!./index";

/** A shared place to get a new worker instance. Will run in a web worker.
    @returns {Promise<import("../yomichanDatabase.js").default>}
 */
export async function newDatabaseWorkerInstance() {
  const workerClass = Comlink.wrap(new DatabaseWorker());
  return new workerClass();
}
