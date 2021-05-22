import { loadJs, base } from "./loader/utils";

// this file is the piece of code that the user needs to copy to the host app's
// configuration in order to get the app running.
loadJs(`${base}/loader.js`);

// now that loader.js has been loaded, we can use its functions
load();
