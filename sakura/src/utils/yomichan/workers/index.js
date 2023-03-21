import * as Comlink from "comlink";
import YomichanDatabase from "../Types";

// This file as a wrapper and exists so that YomichanDatabase can be used with
// Comlink from worker, non-worker and test contexts
Comlink.expose(YomichanDatabase);
